import { Injectable } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
// import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserRole,
  UserResponse,
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
  ListUsersDto,
} from '../user.interface';

@Injectable()
export class UserService {
  // 纯内存存储用户数据
  private readonly users: Map<string, User> = new Map();
  private readonly SALT_ROUNDS = 10;

  // 转换为对外响应（移除密码）
  private toResponse(user: User): UserResponse {
    const { password, ...rest } = user;
    return rest;
  }

  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { nanoid } = await import('nanoid');

    // 检查邮箱和手机号是否已存在
    for (const user of this.users.values()) {
      if (user.email === createUserDto.email) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'Email already exists',
        });
      }
      if (user.phone === createUserDto.phone) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'Phone number already exists',
        });
      }
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);
    const now = Date.now();

    const user: User = {
      id: nanoid(),
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
      created_at: now,
      updated_at: now,
    };

    this.users.set(user.id, user);
    return this.toResponse(user);
  }

  // 根据ID/邮箱/手机号查询用户
  async findOne(getUserDto: GetUserDto): Promise<UserResponse> {
    let foundUser: User | undefined;

    if (getUserDto.id) {
      foundUser = this.users.get(getUserDto.id);
    } else if (getUserDto.email) {
      foundUser = Array.from(this.users.values()).find(
        user => user.email === getUserDto.email,
      );
    } else if (getUserDto.phone) {
      foundUser = Array.from(this.users.values()).find(
        user => user.phone === getUserDto.phone,
      );
    }

    if (!foundUser) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }

    return this.toResponse(foundUser);
  }

  // 更新用户信息
  async update(updateUserDto: UpdateUserDto): Promise<UserResponse> {
    if(!updateUserDto?.id) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'User id must fill',
        });
    }
    const user = this.users.get(updateUserDto?.id);
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }

    // 检查更新的邮箱/手机号是否与其他用户冲突
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      for (const u of this.users.values()) {
        if (u.id !== user.id && u.email === updateUserDto.email) {
          throw new RpcException({
            code: status.ALREADY_EXISTS,
            message: 'Email already exists',
          });
        }
      }
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      for (const u of this.users.values()) {
        if (u.id !== user.id && u.phone === updateUserDto.phone) {
          throw new RpcException({
            code: status.ALREADY_EXISTS,
            message: 'Phone number already exists',
          });
        }
      }
    }

    // 如果更新密码，重新加密
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.SALT_ROUNDS);
    }

    // 更新用户信息
    Object.assign(user, updateUserDto);
    user.updated_at = Date.now();

    this.users.set(user.id, user);
    return this.toResponse(user);
  }

  // 删除用户
  async remove(id: string): Promise<void> {
    if (!this.users.has(id)) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    this.users.delete(id);
  }

  // 分页查询用户列表
  async list(listUsersDto: ListUsersDto) {
    const page = listUsersDto.page || 1;
    const pageSize = listUsersDto.page_size || 10;
    const allUsers = Array.from(this.users.values())
      .sort((a, b) => b.created_at - a.created_at);

    const total = allUsers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const users = allUsers.slice(startIndex, endIndex).map(this.toResponse);

    return {
      users,
      total,
      page,
      page_size: pageSize,
    };
  }

  // 验证密码（供内部使用，如登录服务）
  async validatePassword(id: string, password: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    return bcrypt.compare(password, user.password);
  }
}

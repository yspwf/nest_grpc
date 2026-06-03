// import { Controller } from '@nestjs/common';
// import { GrpcMethod } from '@nestjs/microservices';
// import { UserService } from './user.service';
// import type {
//   CreateUserDto,
//   GetUserDto,
//   UpdateUserDto,
//   ListUsersDto,
// } from '../user.interface';

// @Controller()
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @GrpcMethod('UserService', 'CreateUser')
//   createUser(createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

//   @GrpcMethod('UserService', 'GetUser')
//   getUser(getUserDto: GetUserDto) {
//     return this.userService.findOne(getUserDto);
//   }

//   @GrpcMethod('UserService', 'UpdateUser')
//   updateUser(updateUserDto: UpdateUserDto) {
//     return this.userService.update(updateUserDto);
//   }

//   @GrpcMethod('UserService', 'DeleteUser')
//   deleteUser(data: { id: string }) {
//     return this.userService.remove(data.id);
//   }

//   @GrpcMethod('UserService', 'ListUsers')
//   listUsers(listUsersDto: ListUsersDto) {
//     return this.userService.list(listUsersDto);
//   }
// }

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import type {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
  ListUsersDto,
} from '../user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ 正确写法：第一个参数是服务名 "UserService"
  @GrpcMethod('UserService', 'CreateUser')
  createUser(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @GrpcMethod('UserService', 'GetUser')
  getUser(getUserDto: GetUserDto) {
    return this.userService.findOne(getUserDto);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  updateUser(updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  deleteUser(data: { id: string }) {
    return this.userService.remove(data.id);
  }

  @GrpcMethod('UserService', 'ListUsers')
  listUsers(listUsersDto: ListUsersDto) {
    return this.userService.list(listUsersDto);
  }
}
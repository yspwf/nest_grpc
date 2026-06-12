import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create_user.dto';
import { UpdateUserDto } from './update_user.dto';

export class UserResponseDto {
  id!: number;
  name!: string;
  status!: string;
  create_time!: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const user = this.userRepository.create(createUserDto);
//     return this.userRepository.save(user);
//   }
    async create(dto: CreateUserDto): Promise<UserResponseDto> {
        const user = this.userRepository.create(dto);
        // const saved = await this.userRepository.save(user);
        // const { password, ...result } = saved;

        const { password, ...result } = await this.userRepository.save(user);
        return result;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        // const user = await this.findOne(id);
        // Object.assign(user, updateUserDto);
        // return this.userRepository.save(user);
        const user = await this.findOne(id);
        if (!user) throw new NotFoundException();

        Object.assign(user, updateUserDto);
        const { password, ...result } = await this.userRepository.save(user);
        return result;
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
}
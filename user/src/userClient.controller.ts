// // api-gateway/src/user/user.controller.ts
// import { Controller, Get, Post, Body, Param, Delete, Patch, Query, Inject } from '@nestjs/common';
// import { ClientGrpc } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';
// import type {
//   CreateUserDto,
//   UpdateUserDto,
//   ListUsersDto,
//   UserServiceClient,
// } from './user.interface';

// @Controller('users')
// export class UserController {
//   private userService: UserServiceClient;

//   constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

//   onModuleInit() {
//     this.userService = this.client.getService<UserServiceClient>('UserService');
//   }

//   @Post()
//   async createUser(@Body() createUserDto: CreateUserDto) {
//     return firstValueFrom(this.userService.createUser(createUserDto));
//   }

//   @Get(':id')
//   async getUserById(@Param('id') id: string) {
//     return firstValueFrom(this.userService.getUser({ id }));
//   }

//   @Get('email/:email')
//   async getUserByEmail(@Param('email') email: string) {
//     return firstValueFrom(this.userService.getUser({ email }));
//   }

//   @Get('phone/:phone')
//   async getUserByPhone(@Param('phone') phone: string) {
//     return firstValueFrom(this.userService.getUser({ phone }));
//   }

//   @Get()
//   async listUsers(@Query() listUsersDto: ListUsersDto) {
//     return firstValueFrom(this.userService.listUsers(listUsersDto));
//   }

//   @Patch(':id')
//   async updateUser(
//     @Param('id') id: string,
//     @Body() updateUserDto: Omit<UpdateUserDto, 'id'>,
//   ) {
//     return firstValueFrom(
//       this.userService.updateUser({ id, ...updateUserDto }),
//     );
//   }

//   @Delete(':id')
//   async deleteUser(@Param('id') id: string) {
//     return firstValueFrom(this.userService.deleteUser({ id }));
//   }
// }


import { Controller, Get, Post, Body, Param, Delete, Patch, Query, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type {
  CreateUserDto,
  UpdateUserDto,
  ListUsersDto,
  UserServiceClient, // ✅ 现在可以正常导入了
} from './user.interface';

@Controller('v1/users')
export class UserController {
//   private userService: UserServiceClient;

//   constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

//   onModuleInit() {
//     // 通过 ClientGrpc 获取类型安全的服务客户端
//     this.userService = this.client.getService<UserServiceClient>('UserService');
//   }

// ✅ 添加 ! 明确赋值断言
  private userService!: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    // Nest.js 会在应用启动时自动调用这个方法
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }


  // 后续方法保持不变
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(this.userService.createUser(createUserDto));
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return firstValueFrom(this.userService.getUser({ id }));
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return firstValueFrom(this.userService.getUser({ email }));
  }

  @Get('phone/:phone')
  async getUserByPhone(@Param('phone') phone: string) {
    return firstValueFrom(this.userService.getUser({ phone }));
  }

  @Get()
  async listUsers(@Query() listUsersDto: ListUsersDto) {
    return firstValueFrom(this.userService.listUsers(listUsersDto));
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Omit<UpdateUserDto, 'id'>,
  ) {
    return firstValueFrom(
      this.userService.updateUser({ id, ...updateUserDto }),
    );
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return firstValueFrom(this.userService.deleteUser({ id }));
  }
}

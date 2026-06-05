// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { OrderModule } from './order/order.module';

// @Module({
//   imports: [UserModule, OrderModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserController } from './userClient.controller';
import { OrderClientController } from './orderClient.controller';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    // 注册用户服务 gRPC 客户端
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.USER_GRPC_URL ?? 'localhost:50052',
          package: ['user', 'order'],
          // protoPath: join(__dirname, '../proto/user.proto'),
          protoPath: [
            join(__dirname, '../proto/user.proto'),  
            join(__dirname, '../proto/order.proto')  
          ],
          loader: {
            keepCase: true, // 保持字段名大小写不变
            enums: String, // 枚举值作为字符串返回
            defaults: true,
            arrays: true,
            objects: true,
          },
        },
      },
      // 注册订单服务 gRPC 客户端
      // {
      //   name: 'ORDER_PACKAGE',
      //   transport: Transport.GRPC,
      //   options: {
      //     url: 'localhost:50051', // 订单服务地址
      //     package: 'order',
      //     protoPath: join(__dirname, '../proto/order.proto'),
      //     loader: {
      //       keepCase: true,
      //       enums: String,
      //       defaults: true,
      //       arrays: true,
      //     },
      //   },
      // },
    ]),
    UserModule, 
    OrderModule
  ],
  controllers: [UserController, OrderClientController],
})
export class AppModule {}

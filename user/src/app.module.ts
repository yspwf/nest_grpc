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
import { join } from 'node:path';
import { UserController } from './userClient.controller';
import { OrderClientController } from './orderClient.controller';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepositoryModule } from './userRepository/usersRepository.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { envSchema } from './config/schema';
// import { z } from 'zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/configuration';


@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.cwd() + `/../.env.${process.env.NODE_ENV}`,
      validate: validateEnv
      // validate: (config) => {
      //   // console.log("config", config)
      //   // 使用 zod 校验环境变量
      //   const parsed = envSchema.safeParse(config);
      //   if (!parsed.success) {
      //     console.error('❌ 配置校验失败', parsed.error.format());
      //     throw new Error('Invalid environment variables');
      //   }
      //   return parsed.data;
      // },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') ?? 'sh-postgres-1778mgdq.sql.tencentcdb.com',
        port: config.get('DB_PORT') ?? 26741,
        username: config.get('DB_USER') ?? 'postgresadmin',
        password: config.get('DB_PASSWORD') ?? '...9037160Wfysp',
        database: config.get('DB_NAME') ?? 'postgres',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      })
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'sh-postgres-1778mgdq.sql.tencentcdb.com',
    //   port: 26741,
    //   username: 'postgresadmin',
    //   password: '...9037160Wfysp',
    //   database: 'postgres',
    //   entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    //   // autoLoadEntities: true,
    //   // synchronize: true, // only for dev!
    // }),
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
    OrderModule,
    UsersRepositoryModule
  ],
  controllers: [UserController, OrderClientController, AppController],
  providers: [AppService]
})
export class AppModule {}

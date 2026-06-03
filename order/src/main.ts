// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3001);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051', // gRPC 默认端口
        package: 'order', // 与 proto 文件中的 package 一致
        protoPath: join(__dirname, './proto/order.proto'),
        loader: {
          keepCase: true, // 保持字段名大小写不变
          enums: String, // 枚举值作为字符串返回
          defaults: true, // 为缺失的字段设置默认值
          arrays: true, // 空数组作为默认值
        },
      },
    },
  );

  // 全局启用数据验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('gRPC Order microservice is running on 0.0.0.0:50051');
}

bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.USER_GRPC_BIND_URL ?? '0.0.0.0:50052',
      package: ['user', 'order'],
      protoPath: [
        join(__dirname, '../proto/user.proto'),
        join(__dirname, '../proto/order.proto'),
      ],
      loader: {
        keepCase: true,
        enums: String,
        defaults: true,
        arrays: true,
        objects: true,
      },
    },
  });

  app.setGlobalPrefix('api');

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { join } from 'path';
// // import { ValidationPipe } from '@nestjs/common';
// import { ReflectionService } from '@grpc/reflection';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.GRPC,
//       options: {
//         url: '0.0.0.0:50052', // 用户服务端口（与订单服务50051区分）
//         package: ['user', 'order'],
//         // protoPath: join(__dirname, '../proto/user.proto'),
//         protoPath: [  
//           join(__dirname, '../proto/user.proto'),  
//           join(__dirname, '../proto/order.proto')  
//         ],  
//         loader: {
//           keepCase: true,
//           enums: String,
//           defaults: true,
//           arrays: true,
//           objects: true,
//         },
//         onLoadPackageDefinition: (pkg, server) => {
//           new ReflectionService(pkg).addToServer(server);
//         },
//       },
//     },
//   );

//   // 全局数据验证
//   // app.useGlobalPipes(
//   //   new ValidationPipe({
//   //     whitelist: true,
//   //     forbidNonWhitelisted: true,
//   //     transform: true,
//   //     transformOptions: { enableImplicitConversion: true },
//   //   }),
//   // );

//   await app.listen();
//   console.log('gRPC User microservice is running on 0.0.0.0:50052');
// }

// bootstrap();

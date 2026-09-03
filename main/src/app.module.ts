import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloGateway } from './hello.gateway';
import { PermissionsModule } from './permissions/permissions.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PermissionsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService, HelloGateway],
})
export class AppModule {}

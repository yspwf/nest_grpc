import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CheckPermissions } from '../permissions/permissions.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('posts')
@UseGuards(PermissionsGuard)
export class PostsController {
  @Get()
  @CheckPermissions('posts', 'list')
  list() {
    return { message: 'List all posts' };
  }

  @Get(':id')
  @CheckPermissions('posts', 'read')
  get(@Param('id') id: string) {
    return { message: `Read post ${id}` };
  }

  @Post()
  @CheckPermissions('posts', 'create')
  async create(@Body() body: any) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
    return { message: 'Create post', data: body };
  }

  @Patch(':id')
  @CheckPermissions('posts', 'update')
  update(@Param('id') id: string, @Body() body: any) {
    return { message: `Update post ${id}`, data: body };
  }

  @Delete(':id')
  @CheckPermissions('posts', 'delete')
  delete(@Param('id') id: string) {
    return { message: `Delete post ${id}` };
  }
}
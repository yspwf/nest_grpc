import { Controller, Get, Param, Post, Put, Body, Delete, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskService } from './task.service';
// import { CreateTaskDto } from './create-task.dto';
// import type { UpdateTaskDto } from './task.dto';

import { ZodError, type ZodType } from 'zod';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
} from './create-task.dto';
import type {
  CreateTaskDto,
  UpdateTaskDto,
} from './create-task.dto';

export class SchemaValidationError extends Error {

  constructor(message: string = 'Schema validation failed') {
    super(message);
    this.name = 'SchemaValidationError';
  }

}


@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {

    constructor(private readonly schema: ZodType<T>) {}

    transform(value: unknown): T {
        // const result = this.schema.safeParse(value);
        // if (!result.success) {
        // throw new BadRequestException({
        //     message: 'Validation failed',
        //     errors: result.error.issues.map((issue) => ({
        //     path: issue.path.join('.'),
        //     message: issue.message,
        //     })),
        // });
        // }
        // return result.data;

        try {
            return this.schema.parse(value);
        } catch (e) {
            // 捕获特定Schema验证错误，并抛出Nest.js的BadRequestException
            if (e instanceof SchemaValidationError) {
                throw new BadRequestException(`Schema validation failed: ${e.message}`);
            }

            // 对于Zod等库，通常会抛出特定的错误对象，可以进一步解析
            if (e instanceof ZodError) {
                // console.log("e", e.issues.at(0)?.message);
                throw new BadRequestException({
                    message: e.issues.at(0)?.message,
                    // errors: e.issues.map((issue) => ({
                    //     path: issue.path.join('.'),
                    //     message: issue.message,
                    // })),
                });
            }
            throw e; // 抛出其他未知错误
        }
       
    }
}



@Controller('tasks')
export class TaskController {

  constructor(private readonly taskService: TaskService) {}
 
  @Get()
  findAll() {
    return this.taskService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }
 
  @Post()
  create(@Body(new ZodValidationPipe(CreateTaskSchema)) createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }
  

    @Put(':id')
    update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTaskSchema))
    updateTaskDto: UpdateTaskDto,
    ) {
    return this.taskService.update(Number(id), updateTaskDto);
    }

//   @Post()
//   create(@Body() createTaskDto: CreateTaskDto) {
//     return this.taskService.create(createTaskDto);
//   }
 
//     @Put(':id')
//     update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
//         return this.taskService.update(id, updateTaskDto);
//     }
 
  @Delete(':id')
  remove(@Param('id') id: number) {
    this.taskService.remove(id);
    return { success: true, message: 'Task deleted successfully' };
  }
}

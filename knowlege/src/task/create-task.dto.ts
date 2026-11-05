// import { IsIn, IsString } from 'class-validator';


// export class CreateTaskDto {

//     @IsString({message: 'Title must be a string'})
//     title!: string;

//     @IsString({message: 'Description must be a string'})
//     description!: string;

//     // @IsIn(['pending', 'in_progress', 'review', 'done', 'cancelled'],{
//     //     each: true,
//     //     message: 'Status must be one of: pending, in_progress, review, done, cancelled'
//     // })
//     // status?: 'pending' | 'in_progress' | 'review' | 'done' | 'cancelled';

//     @IsIn(['low', 'medium', 'high'],{
//         each: true,
//         message: 'Priority must be one of: low, medium, high'
//     })
//     priority?: 'low' | 'medium' | 'high' = 'medium';
// }


// export class UpdateTaskDto {

//     @IsString({message: 'Title must be a string'})
//     title!: string;

//     @IsString({message: 'Description must be a string'})
//     description!: string;

//     // @IsIn(['pending', 'in_progress', 'review', 'done', 'cancelled'],{
//     //     each: true,
//     //     message: 'Status must be one of: pending, in_progress, review, done, cancelled'
//     // })
//     // status?: 'pending' | 'in_progress' | 'review' | 'done' | 'cancelled';

//     @IsIn(['low', 'medium', 'high'],{
//         each: true,
//         message: 'Priority must be one of: low, medium, high'
//     })
//     priority?: 'low' | 'medium' | 'high' = 'medium';
// }

import { z } from 'zod';

const priorityEnum = z.enum(['low', 'medium', 'high']);
const statusEnum = z.enum(['pending', 'in_progress', 'review', 'done', 'cancelled']);




export const CreateTaskSchema = z.object({
  title: z.string({
  message: '标题必须是字符串',      // 类型错误时
  }).min(2, '标题至少 2 个字符').max(100, '标题至少 100 个字符'),
  description: z.string().max(200),
  priority: priorityEnum.default('medium')
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;



export const UpdateTaskSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(200).optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional()
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;




// // 用户创建DTO Schema
// export const CreateUserSchema = z.object({
//   username: z.string()
//     .min(3, '用户名至少3个字符')
//     .max(20, '用户名最多20个字符')
//     .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  
//   email: z.string()
//     .email('请输入有效的邮箱地址'),
    
//   password: z.string()
//     .min(8, '密码至少8个字符')
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    
//   age: z.number()
//     .int('年龄必须是整数')
//     .min(18, '年龄必须大于18岁')
//     .max(120, '年龄必须小于120岁'),
    
//   profile: z.object({
//     firstName: z.string().optional(),
//     lastName: z.string().optional(),
//     avatar: z.string().url('头像必须是有效的URL').optional()
//   }).optional()
// });
 
// // 生成NestJS DTO
// export class CreateUserDto extends createZodDto(CreateUserSchema) {}
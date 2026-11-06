"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = exports.UpdateTaskSchema = exports.CreateTaskDto = exports.CreateTaskSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const priorityEnum = zod_1.z.enum(['low', 'medium', 'high']);
const statusEnum = zod_1.z.enum(['pending', 'in_progress', 'review', 'done', 'cancelled']);
exports.CreateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string({ message: '标题必须是字符串' })
        .min(2, '标题至少 2 个字符')
        .max(100, '标题最多 100 个字符'),
    description: zod_1.z.string({ message: '描述必须是字符串' }).max(200, '描述最多 200 个字符'),
    priority: priorityEnum.default('medium')
});
class CreateTaskDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateTaskSchema) {
}
exports.CreateTaskDto = CreateTaskDto;
exports.UpdateTaskSchema = zod_1.z.object({
    title: zod_1.z.string({ message: '标题必须是字符串' }).min(2, '标题至少 2 个字符').max(100, '标题最多 100 个字符').optional(),
    description: zod_1.z.string({ message: '描述必须是字符串' }).max(200, '描述最多 200 个字符').optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional()
});
class UpdateTaskDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateTaskSchema) {
}
exports.UpdateTaskDto = UpdateTaskDto;
//# sourceMappingURL=create-task.dto.js.map
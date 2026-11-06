import { z } from 'zod';
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
}, z.core.$strip>;
declare const CreateTaskDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
}, z.core.$strip>, false>;
export declare class CreateTaskDto extends CreateTaskDto_base {
}
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        review: "review";
        done: "done";
        cancelled: "cancelled";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
}, z.core.$strip>;
declare const UpdateTaskDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        review: "review";
        done: "done";
        cancelled: "cancelled";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
}, z.core.$strip>, false>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
}
export {};

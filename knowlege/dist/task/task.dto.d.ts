export type taskStatus = 'pending' | 'in_progress' | 'review' | 'done' | 'cancelled';
export type taskPriority = 'low' | 'medium' | 'high';
export declare const TASK_VALUE_LABELS: Record<taskStatus, string>;
export interface Task {
    id: number;
    title: string;
    description: string;
    status: taskStatus;
    priority: taskPriority;
    createdAt: string;
    updatedAt: string;
}
export interface CreateTaskDto {
    title: string;
    description: string;
    status?: taskStatus;
    priority?: taskPriority;
}
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: taskStatus;
    priority?: taskPriority;
}

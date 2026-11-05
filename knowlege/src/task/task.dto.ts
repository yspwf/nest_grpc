export type taskStatus = 'pending' | 'in_progress' | 'review' | 'done' | 'cancelled';
export type taskPriority = 'low' | 'medium' | 'high';


export const TASK_VALUE_LABELS: Record<taskStatus, string> = {
  pending: '待处理',
  in_progress: '进行中',
  review: '审核中',
  done: '已完成',
  cancelled: '已取消'
};


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
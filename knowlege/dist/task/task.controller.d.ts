import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './create-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    findAll(): import("./task.dto").Task[];
    findOne(id: number): import("./task.dto").Task;
    create(createTaskDto: CreateTaskDto): import("./task.dto").Task;
    update(id: string, updateTaskDto: UpdateTaskDto): import("./task.dto").Task;
    remove(id: number): {
        success: boolean;
        message: string;
    };
}

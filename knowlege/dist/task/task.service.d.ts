import { CreateTaskDto, Task, UpdateTaskDto } from "./task.dto";
export declare class TaskService {
    private tasks;
    private idCounter;
    create(createTaskDto: CreateTaskDto): Task;
    findAll(): Task[];
    findOne(id: number): Task;
    update(id: number, updateTaskDto: UpdateTaskDto): Task;
    remove(id: number): void;
}

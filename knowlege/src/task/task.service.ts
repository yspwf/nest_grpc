import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto, Task, UpdateTaskDto } from "./task.dto";

@Injectable()
export class TaskService {
  private tasks: Task[] = [];
  private idCounter:number = 1;
 
  create(createTaskDto: CreateTaskDto): Task {
    const newTask: Task = {
      id: (this.idCounter++),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: 'pending',
      priority: createTaskDto.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }
 
  findAll(): Task[] {
    return this.tasks;
  }
 
  findOne(id: number): Task {
    const task = this.tasks.find((t: Task) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }
 
  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const index = this.tasks.findIndex((t: Task) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }   
 
    const updatedTask = {
      ...this.tasks[index],
      ...updateTaskDto,
      updatedAt: new Date().toISOString(),
    };
 
    this.tasks[index] = updatedTask;
    return updatedTask;
  }
 
  remove(id: number): void {
    const index = this.tasks.findIndex((t: Task) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(index, 1);
  }
}
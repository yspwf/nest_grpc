"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
let TaskService = class TaskService {
    tasks = [];
    idCounter = 1;
    create(createTaskDto) {
        const newTask = {
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
    findAll() {
        return this.tasks;
    }
    findOne(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    update(id, updateTaskDto) {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        const updatedTask = {
            ...this.tasks[index],
            ...updateTaskDto,
            updatedAt: new Date().toISOString(),
        };
        this.tasks[index] = updatedTask;
        return updatedTask;
    }
    remove(id) {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        this.tasks.splice(index, 1);
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)()
], TaskService);
//# sourceMappingURL=task.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CustomExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_zod_1 = require("nestjs-zod");
let CustomExceptionFilter = CustomExceptionFilter_1 = class CustomExceptionFilter {
    logger = new common_1.Logger(CustomExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message;
        if (exception instanceof nestjs_zod_1.ZodValidationException) {
            const zodError = exception.getZodError();
            message = zodError.issues.map((issue) => issue.message);
        }
        else if (exception instanceof common_1.HttpException) {
            message = exception.message;
        }
        else {
            message = 'Internal server error';
        }
        if (!(exception instanceof common_1.HttpException)) {
            this.logger.error('Unhandled exception occurred', exception instanceof Error ? exception.stack : String(exception), {
                path: request.url
            });
        }
        response.status(status).json({
            code: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.CustomExceptionFilter = CustomExceptionFilter;
exports.CustomExceptionFilter = CustomExceptionFilter = CustomExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], CustomExceptionFilter);
//# sourceMappingURL=custom-exception.filter.js.map
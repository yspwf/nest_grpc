"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatMiddleware = void 0;
const common_1 = require("@nestjs/common");
let ResponseFormatMiddleware = class ResponseFormatMiddleware {
    use(req, res, next) {
        const originalSend = res.send;
        res.send = function (body) {
            const formattedBody = {
                code: res.statusCode,
                data: body,
                timestamp: new Date().toISOString(),
            };
            originalSend.call(formattedBody);
        };
        next();
    }
};
exports.ResponseFormatMiddleware = ResponseFormatMiddleware;
exports.ResponseFormatMiddleware = ResponseFormatMiddleware = __decorate([
    (0, common_1.Injectable)()
], ResponseFormatMiddleware);
//# sourceMappingURL=response-format.middleware.js.map
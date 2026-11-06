"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFormatFn = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const compression_1 = __importDefault(require("compression"));
const responseFormatFn = (req, res, next) => {
    const originalSend = res.send.bind(res);
    res.send = function (body) {
        if (!res.locals.__formatted) {
            res.locals.__formatted = true;
            body = {
                code: res.statusCode,
                data: body,
                timestamp: new Date().toISOString(),
            };
        }
        return originalSend(body);
    };
    next();
};
exports.responseFormatFn = responseFormatFn;
const logger = new common_1.Logger();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, compression_1.default)());
    logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
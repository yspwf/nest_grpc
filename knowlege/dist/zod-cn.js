"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodErrorToChinese = zodErrorToChinese;
const CN_MESSAGES = {
    invalid_type: '字段类型错误',
    invalid_string: '格式不正确',
    too_small: '长度/数值过小',
    too_big: '长度/数值过大',
    invalid_enum_value: '选项值不在允许范围内',
    unrecognized_keys: '包含未知字段',
    invalid_arguments: '参数错误',
    custom: '校验失败',
};
function zodErrorToChinese(error) {
    return error.issues.map((issue) => {
        const field = issue.path.join('.');
        const base = CN_MESSAGES[issue.code] ?? issue.message;
        let detail = '';
        if (issue.code === 'too_small') {
            detail = issue.origin === 'string' ? `至少 ${issue.minimum} 个字符`
                : issue.origin === 'number' ? `不能小于 ${issue.minimum}`
                    : '';
        }
        if (issue.code === 'too_big') {
            detail = issue.origin === 'string' ? `最多 ${issue.maximum} 个字符`
                : issue.origin === 'number' ? `不能大于 ${issue.maximum}`
                    : '';
        }
        return `${field}: ${base}${detail}`;
    });
}
//# sourceMappingURL=zod-cn.js.map
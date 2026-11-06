export interface User {
    id: number;
    name: string;
    email: string;
}
export declare class CreateDto {
    name: string;
    age: number;
}
export declare class ResponseDto<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}
export declare class ResponseFormatDto<T> {
    code: number;
    data: T;
    timestamp: string;
}

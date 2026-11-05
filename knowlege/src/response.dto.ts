export interface User {
    id: number;
    name: string;
    email: string;
}

export class CreateDto {
    name!: string;
    age!: number;
}


export class ResponseDto<T> {
    statusCode!: number;
    message!: string;
    data!: T;
    timestamp!: string;
}   

export class ResponseFormatDto<T> {
    code!: number;
    data!: T;
    timestamp!: string;
}   

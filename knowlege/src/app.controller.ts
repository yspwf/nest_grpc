import { Controller, Get, Post, UseGuards, Body, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { User } from './response.dto';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';


export class CreateDto {
  @IsString()
  name!: string;

  @IsInt()
  age!: number;

  @IsOptional()
  email?: string = '';
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthService)
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('exception')
  @UseGuards(AuthService)
  exception(): string {
    throw new HttpException('Test exception', HttpStatus.BAD_REQUEST);

    // return 'Exception endpoint';
  }


  @Get('test')
  @UseGuards(AuthService)
  test(): User[] {
    return this.appService.getTest();
  }

  @Post('create')
  @UseGuards(AuthService)
  @UsePipes(new ValidationPipe({
    whitelist: true,           // 自动剥离不在 DTO 中的字段
    forbidNonWhitelisted: true, // 抛出异常当存在非法字段
    transform: true,           // 自动将请求体转换为 DTO 实例
    disableErrorMessages: false, 
    validationError: { target: false },  // 隐藏原始对象，增强安全性。
    // whitelist: true, 
    // forbidNonWhitelisted: true, 
    // transform: true,
    // transform: true, // 自动类型转换
    // forbidNonWhitelisted: true // 禁止多余字段
  }))
  create(@Body() createDto: CreateDto): string {
    console.log('Received data:', createDto);
    return 'Create endpoint';
  }
}

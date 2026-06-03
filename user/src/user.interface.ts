// export enum UserRole {
//   USER = 'USER',
//   ADMIN = 'ADMIN',
// }

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   phone: string;
//   password: string; // 仅内部存储，不返回给客户端
//   role: UserRole;
//   created_at: number;
//   updated_at: number;
// }

// // 对外返回的用户DTO（不含密码）
// export interface UserResponse {
//   id: string;
//   username: string;
//   email: string;
//   phone: string;
//   role: UserRole;
//   created_at: number;
//   updated_at: number;
// }

// export interface CreateUserDto {
//   username: string;
//   email: string;
//   phone: string;
//   password: string;
//   role?: UserRole;
// }

// export interface GetUserDto {
//   id?: string;
//   email?: string;
//   phone?: string;
// }

// export interface UpdateUserDto {
//   id: string;
//   username?: string;
//   email?: string;
//   phone?: string;
//   password?: string;
// }

// export interface ListUsersDto {
//   page?: number;
//   page_size?: number;
// }

import { Observable } from 'rxjs';

// 用户角色枚举
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// 用户基础接口
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: number;
  updated_at: number;
  password: string; // 仅内部存储，不返回给客户端
}

// 创建用户请求
export interface CreateUserDto {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

// 获取用户请求（支持多条件查询）
export interface GetUserDto {
  id?: string;
  email?: string;
  phone?: string;
}

// 更新用户请求
export interface UpdateUserDto {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}

// 分页查询用户请求
export interface ListUsersDto {
  page?: number;
  page_size?: number;
}

// 用户列表响应
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

// 空响应
export interface EmptyResponse {}

// ✅ 关键：添加 gRPC 服务客户端接口
export interface UserServiceClient {
  createUser(request: CreateUserDto): Observable<User>;
  getUser(request: GetUserDto): Observable<User>;
  updateUser(request: UpdateUserDto): Observable<User>;
  deleteUser(request: { id: string }): Observable<EmptyResponse>;
  listUsers(request: ListUsersDto): Observable<UserListResponse>;
}


export interface UserResponse {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: number;
  updated_at: number;
}
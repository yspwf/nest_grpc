import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
import { CHECK_PERMISSIONS_KEY } from './permissions.decorator';
import { Context } from './interface/permission.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requirement = this.reflector.get<{ resource: string; action: string }>(
      CHECK_PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // 需提前通过认证中间件注入
    
    console.log(`User: ${JSON.stringify(user)}, Requirement: ${JSON.stringify(requirement)}`);


    // 构造上下文（简化：从请求参数获取资源属性）
    const ctx: Context = {
      user: {
        id: user?.id || 'unknown',
        role: user?.role || 'guest',
      },
      resource: {
        type: requirement.resource,
        // 从路径参数或body尝试提取 owner_id 等
        ...this.extractResourceAttributes(request),
      },
      request: {
        ip: request.ip,
        time: new Date(),
      },
    };
    console.log(`Checking permissions for user ${ctx.user.id} with role ${ctx.user.role} on resource ${requirement.resource} for action ${requirement.action}`);
    const allowed = this.permissionsService.can(ctx, requirement.resource, requirement.action);
    if (!allowed) {
      throw new ForbiddenException('权限不足');
    }
    return true;
  }

  private extractResourceAttributes(request: any): Record<string, any> {
    const attrs: Record<string, any> = {};
    if (request.params.id) attrs['id'] = request.params.id;
    if (request.body?.user_id) attrs['user_id'] = request.body.user_id;
    if (request.body?.owner_id) attrs['user_id'] = request.body.owner_id; // 兼容字段
    return attrs;
  }
}
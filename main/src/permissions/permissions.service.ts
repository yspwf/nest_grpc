import { Injectable, Logger } from '@nestjs/common';
import { loadYaml } from './yaml-loader';
import { RoleConfig, Permission, Policy, Context, PolicyRule } from './interface/permission.interface';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  private roles: Record<string, RoleConfig>;
  private policies: Record<string, Policy>;

  constructor() {
    const rolesData = loadYaml<{ roles: Record<string, RoleConfig> }>('roles.yml');
    const policiesData = loadYaml<{ policies: Record<string, Policy> }>('policies.yml');
    this.roles = rolesData.roles;
    this.policies = policiesData.policies;
    this.logger.log(`Loaded ${Object.keys(this.roles).length} roles, ${Object.keys(this.policies).length} policies`);
  }

  can(context: Context, resource: string, action: string): boolean {
    const { user } = context;
    const roleName = user.role;

    // 1. 获取有效权限（含继承）
    const permissions = this.getEffectivePermissions(roleName);
    console.log(`Effective permissions for role ${roleName}: ${JSON.stringify(permissions)}`);
    // 2. 先处理 deny（示例未使用，但保留）
    for (const perm of permissions) {
      if (this.matches(perm, resource, action) && perm.effect === 'deny') {
        if (!perm.conditions || this.evaluateConditions(perm.conditions, context)) {
          return false;
        }
      }
    }

    // 3. 处理 allow
    for (const perm of permissions) {
      if (this.matches(perm, resource, action) && perm.effect === 'allow') {
        const conditionsOk = !perm.conditions || this.evaluateConditions(perm.conditions, context);
        if (conditionsOk) {
          // 额外检查全局策略
          const policyOk = this.evaluateGlobalPolicies(context, resource, action);
          return policyOk;
        }
      }
    }

    return false;
  }

  private getEffectivePermissions(roleName: string): Permission[] {
    const role = this.roles[roleName];
    if (!role) return [];
    const perms = [...role.permissions];
    for (const parent of role.extends) {
      perms.push(...this.getEffectivePermissions(parent));
    }
    return perms;
  }

  private matches(perm: Permission, resource: string, action: string): boolean {
    const resourceMatch = perm.resource === '*' ||
      (Array.isArray(perm.resource) ? perm.resource.includes(resource) : perm.resource === resource);
    const actionMatch = perm.action === '*' ||
      (Array.isArray(perm.action) ? perm.action.includes(action) : perm.action === action);
    return resourceMatch && actionMatch;
  }

  private evaluateConditions(conditions: Array<{ type: string; params: any }>, context: Context): boolean {
    for (const cond of conditions) {
      if (!this.evaluateCondition(cond.type, cond.params, context)) return false;
    }
    return true;
  }

  private evaluateCondition(type: string, params: any, context: Context): boolean {
    const { user, resource, request } = context;

    switch (type) {
      case 'ownership':
        return resource[params.field] === user.id;
      case 'time_range':
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const current = `${hours}:${minutes}`;
        return current >= params.start && current <= params.end;
      default:
        this.logger.warn(`Unknown condition: ${type}`);
        return true;
    }
  }

  private evaluateGlobalPolicies(context: Context, resource: string, action: string): boolean {
    for (const [name, policy] of Object.entries(this.policies)) {
      if (policy.type === 'abac' && policy.rules) {
        for (const rule of policy.rules) {
          // 检查资源/动作匹配
          if (rule.resource) {
            const resMatch = rule.resource === '*' ||
              (Array.isArray(rule.resource) ? rule.resource.includes(resource) : rule.resource === resource);
            if (!resMatch) continue;
          }
          if (rule.action) {
            const actMatch = rule.action === '*' ||
              (Array.isArray(rule.action) ? rule.action.includes(action) : rule.action === action);
            if (!actMatch) continue;
          }
          // 评估条件
          const condPass = this.evaluateCondition(rule.condition.type, rule.condition, context);
          if (!condPass) {
            return false; // 任意策略失败则拒绝
          }
        }
      }
    }
    return true;
  }
}
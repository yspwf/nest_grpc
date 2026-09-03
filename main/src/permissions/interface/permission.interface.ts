export interface Permission {
  resource: string | string[];
  action: string | string[];
  effect: 'allow' | 'deny';
  conditions?: Array<{
    type: string;
    params: Record<string, any>;
  }>;
}

export interface RoleConfig {
  description: string;
  extends: string[];
  permissions: Permission[];
}

export interface PolicyRule {
  resource?: string | string[];
  action?: string | string[];
  condition: {
    type: string;
    [key: string]: any;
  };
}

export interface Policy {
  description: string;
  type: 'abac' | 'composite';
  rules?: PolicyRule[];
}

export interface Context {
  user: {
    id: string;
    role: string;
    [key: string]: any;
  };
  resource: {
    type: string;
    [key: string]: any;
  };
  request: {
    ip?: string;
    time?: Date;
    [key: string]: any;
  };
}
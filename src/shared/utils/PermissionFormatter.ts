
 
export class PermissionFormatter  {
 static formatScope(modulePrefix: string): string {
    return modulePrefix.replace(/\//g, '').replace(/s$/, '');
  }

  static formatAction(handlerName: string): string {
    return handlerName.replace(/^bound\s*/, '');
  }

  static getPermissionCode(scope: string, controller: string, action: string): string {
    return `${scope}.${controller}:${action}`;
  }

  static getName(scope: string, action: string): string {
    const resource = scope.endsWith('s') ? scope.slice(0, -1) : scope;
    return `${action}_${resource}`;
  }

  static getDescription(scope: string, action: string): string {
    const resource = scope.endsWith('s') ? scope.slice(0, -1) : scope;
    return `${action} ${resource}`;
  }

  static formatPermissionCode(modulePrefix: string, controller: string, handlerName: string): string {
    const scope = this.formatScope(modulePrefix);
    const action = this.formatAction(handlerName);
    return this.getPermissionCode(scope, controller, action);
  }
}
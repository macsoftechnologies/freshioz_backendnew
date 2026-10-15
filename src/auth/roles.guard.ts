import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Access denied. No authenticated user context.');
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      // If RolesGuard is applied without specific role declarations, require an internal employee role
      if (user.type !== 'EMPLOYEE' && !user.roles?.includes('SUPER_ADMIN')) {
        throw new ForbiddenException('Access denied. Staff employee privileges required.');
      }
      return true;
    }

    // Super Admin has master access across all resources
    if (user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Requires one of the following roles: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}

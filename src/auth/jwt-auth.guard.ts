import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authentication required. Missing Bearer token.');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid token format. Format must be "Bearer <token>".');
    }

    try {
      const decoded = this.jwtService.verify(parts[1]);
      request.user = decoded;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Session expired or invalid token. Please log in again.');
    }
  }
}

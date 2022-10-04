import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";
import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";

config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization.split(' ').pop();

    const { role } = this.jwtService.verify(token);

    return requiredRoles.includes(role);
  }
}
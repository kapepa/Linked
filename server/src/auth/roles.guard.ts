import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
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
    const req = context.switchToHttp().getRequest();
    if (!requiredRoles || !req?.user) return true;

    const res = requiredRoles.includes(req.user.role);
    if(!res) throw new HttpException('No access to this content', HttpStatus.GONE);

    return res;
  }
}
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable} from 'rxjs';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SocketGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const bearerToken = context['args'][0].handshake.headers.authorization.split(' ')[1];

    let decode = this.jwtService.decode(bearerToken);
    if(!decode) throw new UnauthorizedException();

    return true;
  }

}

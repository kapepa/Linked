import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {Observable, of, switchMap, take} from 'rxjs';
import { FeetService } from "../feet/feet.service";
import {FeetInterface} from "../feet/feet.interface";

@Injectable()
export class FounderGuard implements CanActivate {
  constructor(
    private feetService: FeetService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    return this.feetService.allFeet({ where: { 'author': { id: user.id } } , relations: [ 'author' ] }).pipe(
      take(1),
      switchMap((feetList: FeetInterface[]) => {
        return of(feetList.some(feet => feet.id === request.params.id))
      })
    );
  }
}

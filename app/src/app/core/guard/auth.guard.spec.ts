import { TestBed, waitForAsync } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from "../service/auth.service";
import {from, of} from "rxjs";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;

  let mockAuthService = {
    isLogin: of(false),
    tokenExp: of(false),
  }

  let routerSpy = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: mockAuthService },
      ],
      imports: [RouterTestingModule],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('unit test allow access' ,() => {
    authGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe((next: boolean) => {
      expect(next).toBeFalsy();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth','login']);
    });
  })

});

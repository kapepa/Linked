import { TestBed } from '@angular/core/testing';

import { UserResolver } from './user.resolver';
import {UserService} from "../service/user.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

describe('UserResolver', () => {
  let resolver: UserResolver;
  let mockUser = UserClass;

  let mockUserService = {
    getUser: of(undefined),
    getOwnProfile: () => of(mockUser),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: mockUserService },
      ]
    });
    resolver = TestBed.inject(UserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolver allow access to page, UserResolver', () => {
    spyOn(mockUserService, "getOwnProfile").and.returnValue(of(mockUser));

    resolver.resolve({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe((bol: boolean) => {
      expect(mockUserService.getOwnProfile).toHaveBeenCalled();
      expect(bol).toBeTruthy();
    })
  })

});

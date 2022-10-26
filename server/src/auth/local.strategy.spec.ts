import { Test } from "@nestjs/testing";
import { LocalStrategy } from "./local.strategy";
import {UserClass} from "../core/utility/user.class";
import {UsersInterface} from "../users/users.interface";
import {AuthService} from "./auth.service";
import {of} from "rxjs";
import {UnauthorizedException} from "@nestjs/common";

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let mockUser = UserClass as UsersInterface;
  let mockPassword = 'mockPassword';

  let mockAuthService = {
    validateUser: jest.fn(),
  }

  beforeEach( async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  })

  it('should be defined LocalStrategy', () => {
    expect(strategy).toBeDefined();
  })

  describe('validate()', () => {
    it('have user data', () => {
      jest.spyOn(mockAuthService, 'validateUser').mockReturnValueOnce(of({...mockUser, password: mockPassword}));

      strategy.validate(mockUser.email, mockPassword).subscribe((user: UsersInterface) => {
        expect(mockAuthService.validateUser).toHaveBeenCalledWith(mockUser.email, mockPassword);
        expect(user).toEqual({...mockUser, password: mockPassword});
      })
    })

    it('UnauthorizedException', () => {
      jest.spyOn(mockAuthService, 'validateUser').mockReturnValueOnce(of(undefined));

      strategy.validate(mockUser.email, mockPassword).subscribe({
        error: (err) => {
          expect(err.response).toEqual({ statusCode: 401, message: 'Unauthorized' });
        },
      })
    })
  })

})
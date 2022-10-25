import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "../users/users.dto";
import { of } from "rxjs";

describe('AuthController', () => {
  let controller: AuthController;

  let mockUser = UserClass as UsersDto;

  let mockAuthService = {
    loginUser: jest.fn(),
    registrationUser: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login auth, login()', () => {
    let mockToken = {access_token: 'token_string'};
    jest.spyOn(mockAuthService, 'loginUser').mockReturnValueOnce(of(mockToken));

    controller.login({user: mockUser}).subscribe((token: {access_token: string}) => {
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(mockUser);
      expect(token).toEqual(mockToken);
    })
  })

  describe('registration()', () => {
    let mockCreate = { firstName: 'MyFirstName', lastName: 'MySecondName', email: 'test@email.com' } as UsersDto;

    it('The user has been successfully registration, registration()', () => {
      jest.spyOn(mockAuthService, 'registrationUser').mockReturnValueOnce(of(true));

      controller.registration({} as Express.Multer.File, mockCreate).subscribe((res: boolean) => {
        expect(mockAuthService.registrationUser).toHaveBeenCalledWith(mockCreate);
        expect(res).toBeTruthy();
      })
    })

    it('There is no registration data in the following request', () => {
      controller.registration({} as Express.Multer.File, {}).subscribe({
        error: (err) => {
          expect(err.response).toEqual('There is no registration data in the following request.');
        }
      })
    })
  })

  it('add role, roleAdd()', () => {
    controller.roleAdd();
  })

});

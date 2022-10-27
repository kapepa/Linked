import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "../users/users.dto";
import { of } from "rxjs";
import * as bcrypt from "bcrypt";
import { UsersInterface } from "../users/users.interface";
import { config } from "dotenv";

config();

describe('AuthService', () => {
  let service: AuthService;

  let mockUser = UserClass as UsersDto;

  let mockUsersService = {
    findOne: jest.fn(),
    existUser: jest.fn(),
    saveUser: jest.fn(),
  }

  let mockJwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validate user, validateUser()', () => {
    let mockPassword = 'mockPassword'
    let mockData = {...mockUser, password: 'hashPassword'};

    jest.spyOn(mockUsersService, 'findOne').mockReturnValueOnce(of(mockData));
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(of(true))

    service.validateUser(mockUser.email, mockPassword).subscribe((user: UsersInterface) => {
      expect(mockUsersService.findOne).toHaveBeenCalledWith( 'email', mockUser.email, {select: ['id', 'firstName', 'lastName', 'email', 'password', 'role']} );
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockData.password);
      expect(user).toEqual(mockData);
    })
  })

  describe('registrationUser()', () => {
    let hashPassword = 'hashPassword';
    let mockCreate = {lastName: mockUser.lastName, firstName: mockUser.lastName, email: mockUser.email, password: hashPassword } as UsersDto;

    it('success create user', () => {
      jest.spyOn(mockUsersService, 'existUser').mockReturnValueOnce(of(false));
      jest.spyOn(mockUsersService, 'saveUser').mockReturnValueOnce(of({...mockUser, password: hashPassword}));
      jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(of(hashPassword));

      service.registrationUser(mockCreate).subscribe(( res: boolean ) => {
        expect(mockUsersService.existUser).toHaveBeenCalledWith('email', mockCreate.email);
        expect(bcrypt.hash).toHaveBeenCalledWith(hashPassword, parseInt(process.env.BCRYPT_SALT));
        expect(res).toBeTruthy();
      })
    })

    it('This email already exists', () => {
      jest.spyOn(mockUsersService, 'existUser').mockReturnValueOnce(of(true));

      service.registrationUser(mockCreate).subscribe({
        error: (err) => {
          expect(err.response).toEqual('This email already exists');
        }
      })
    })
  })

  it('login user, loginUser()', () => {
    let mockToken = 'jwt_token';
    jest.spyOn(mockJwtService, 'sign').mockReturnValueOnce(mockToken);

    service.loginUser(of(mockUser)).subscribe((token: {access_token: string}) => {
      let {firstName, lastName, id, role, avatar} = mockUser
      expect(mockJwtService.sign).toHaveBeenCalledWith({firstName, lastName, id, role, avatar});
      expect(token).toEqual({access_token: mockToken});
    });
  })

});

import { FounderGuard } from './founder.guard';
import { Test, TestingModule } from "@nestjs/testing";
import { FeetService } from "../feet/feet.service";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "../users/users.dto";
import { of } from "rxjs";
import { FeetClass } from "../core/utility/feet.class";
import { FeetDto } from "../feet/feet.dto";

describe('FounderGuard', () => {
  let guard: FounderGuard;

  let mockUser = UserClass as UsersDto;
  let mockFeet = FeetClass as FeetDto;

  let mockFeetService = {
    allFeet: jest.fn(),
  }

  let mockContext = {
    getClass: jest.fn(),
    getHandler: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: "providedToken"
        },
        user: mockUser,
        params: {
          id: mockFeet.id,
        },
      })
    }))
  } as any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FounderGuard,
        { provide: FeetService, useValue: mockFeetService },
      ],
      imports: []
    }).compile();

    guard = module.get<FounderGuard>(FounderGuard);
  })

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('check author feet and return boole', () => {
    jest.spyOn(mockFeetService, 'allFeet').mockReturnValueOnce(of([{...mockFeet, author: mockUser}]));

    guard.canActivate(mockContext).subscribe((bol: boolean) => {
      expect(mockFeetService.allFeet).toHaveBeenCalledWith({ where: { 'author': { id: mockUser.id } } , relations: [ 'author' ] });
      expect(bol).toBeTruthy();
    });

  })
});

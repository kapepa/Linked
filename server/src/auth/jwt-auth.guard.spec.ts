import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UserClass } from "../core/utility/user.class";
import { UsersInterface } from "../users/users.interface";

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard

  let mockUser = UserClass as UsersInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard
      ]
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  })

  it('should be defined JwtAuthGuard', () => {
    expect(guard).toBeDefined();
  })

  describe('handleRequest()', () => {
    it('should be return user', () => {
      let handler = guard.handleRequest(undefined, mockUser, {});
      expect(handler).toEqual(mockUser);
    })

    it('UnauthorizedException', () => {
      try {
        guard.handleRequest(undefined, undefined, {});
      } catch (err) {
        expect(err.response).toEqual({statusCode: 401, message: 'Unauthorized'});
      }
    })
  })
})
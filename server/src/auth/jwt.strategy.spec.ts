import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserClass } from "../core/utility/user.class";
import { UsersInterface } from "../users/users.interface";


describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let mockUser = UserClass as UsersInterface

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined JwtStrategy', () => {
    expect(jwtStrategy).toBeDefined();
  })

  it('validate jwt strategy', async () => {
    let payload = await jwtStrategy.validate(mockUser);
    expect(payload).toEqual(mockUser);
  })
});
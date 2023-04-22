import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import {UserClass} from "../src/core/utility/user.class";
import {FeetInterface} from "../src/feet/feet.interface";
import {config} from "dotenv";
import {DeleteResult, Repository} from "typeorm";
import {CommentInterface} from "../src/feet/comment.interface";
import {User} from "../src/users/users.entity";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {AccessEnum} from "../src/feet/access.enum";
import {AdditionClass} from "../src/core/utility/addition.class";
import {FeetDto} from "../src/feet/feet.dto";

config();

describe('Feet (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let additionClass = { jobTitle: 'additionJobTitle', company: 'additionCompany', placesWork: 'additionPlacesWork', region: 'additionRegion' };
  let feelClass = { img: ['feetImg.png'], video: '', file: '', body: 'body feet', access: AccessEnum.CONTACT, addition: additionClass }
  let commentClass = { comment: 'comment' }

  let userData: ProfileInterface = {token: undefined, profile: undefined};
  let feelData: {feel: FeetInterface, comment: CommentInterface} = {feel: undefined, comment: undefined};

  let mockDeleteResult: DeleteResult = {raw: [], affected: 1};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepository = moduleRef.get('UserRepository');
    app = moduleRef.createNestApplication();

    await app.init();

    await MemoryDb.createUser(userClass, userRepository).then( async (user) => {
      userData.profile = user;
      userData.token = await MemoryDb.createToken(user);
    })
  });

  afterAll(async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await app.close();
  })

  describe('(POST) createFeet()', () => {
    it('should be create feet', () => {
      return request(app.getHttpServer())
        .post('/feet/create')
        .set('Authorization', `Bearer ${userData.token}`)
        .send(feelClass)
        .expect(201)
        .expect((res: Response & {body: FeetInterface}) => {
          let { addition, ...feet} = res.body;
          feelData.feel = res.body;
          // expect(res.body.access).toEqual(feelClass.access);
          // expect(res.body.body).toEqual(feelClass.body);
          // expect(res.body.addition.jobTitle).toEqual(additionClass.jobTitle);
          // expect(res.body.addition.company).toEqual(additionClass.company);
          // expect({...feet, addition: {}}).toEqual(expect.objectContaining({...feelClass, addition: {}}))
          // expect(addition).toEqual(expect.objectContaining({additionClass}))
        })
    })
  })

});
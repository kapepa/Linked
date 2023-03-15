import {Test, TestingModule} from '@nestjs/testing';
import {MailController} from './mailer.controller';
import {MailService} from "./mailer.service";
import {of} from "rxjs";
import {UsersDto} from "../users/users.dto";

const MockMailService = {
  regUser: jest.fn(),
}

describe('MailerController', () => {
  let controller: MailController;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        { provide: MailService, useValue: MockMailService }
      ]
    }).compile();

    controller = module.get<MailController>(MailController);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('regUser', () => {
    let spyRegUser = jest.spyOn(mailService, 'regUser').mockImplementation( () => of({} as any) );

    controller.regUser({}).subscribe({
      next: (res) => {
        expect(res).toEqual({});
        expect(spyRegUser).toHaveBeenCalledWith({});
      }
    })
  })
});

import {Test, TestingModule} from '@nestjs/testing';
import {MailService} from './mailer.service';
import {MailerService} from "@nestjs-modules/mailer";
import {UserClass} from "../core/utility/user.class";
import {UsersDto} from "../users/users.dto";
import {of} from "rxjs";

let MockMailerService = {
  sendMail: jest.fn(),
}

describe('MailerService', () => {
  let service: MailService;
  let mailerService: MailerService;

  let userClass = UserClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: MockMailerService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('regUser', () => {
    let mockUserClass = userClass as UsersDto;
    let spySendMail = jest.spyOn(mailerService, 'sendMail').mockResolvedValue( () => of({} as any) );

    service.regUser(mockUserClass).subscribe({
      next: () => {
        expect(spySendMail).toHaveBeenCalled();
      }
    })
  })

});

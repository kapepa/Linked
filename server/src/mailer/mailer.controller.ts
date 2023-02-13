import {Body, Controller, Get} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {MailService} from "./mailer.service";

@ApiTags('mailer')
@Controller('mailer')
export class MailController {
  constructor(
    private mailService: MailService,
  ) {}

  @Get('reg')
  regUser(@Body() body) {
    return this.mailService.regUser(body);
  }

}

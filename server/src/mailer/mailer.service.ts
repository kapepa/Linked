import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as dotenv from "dotenv";
import {from, Observable} from "rxjs";
import {UsersDto} from "../users/users.dto";

dotenv.config();

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  regUser(body: UsersDto): Observable<any> {
    const {firstName, lastName, email} = body;

    return from(
      this.mailerService
        .sendMail({
          to: email,
          from: process.env.MAILDEV_INCOMING_USER,
          subject: 'Congratulations on registration.',
          text: 'Welcome to Linked.',
          html: '<b>Congratulations on your successful registration ' +  firstName + ' ' + lastName + '</b>',
        }))
  }
}

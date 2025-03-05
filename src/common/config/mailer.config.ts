import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export function sendMail(configService: ConfigService): nodemailer.Transporter {
  const host = configService.get<string>('MAIL_HOST');
  const port = configService.get<number>('MAIL_PORT');
  const user = configService.get<string>('MAIL_USER');
  const pass = configService.get<string>('MAIL_PASS');

  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
}

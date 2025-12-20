import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mail: MailService) {}

  @Get('test')
  async test(@Query('email') email: string) {
    const fakeToken = 'test-token-123';

    await this.mail.sendVerificationEmail(email, fakeToken);

    return { success: true, message: `Test email sent to ${email}` };
  }
}

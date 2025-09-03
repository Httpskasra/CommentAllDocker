import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendOtp(phone: string, code: string) {
    // TODO: Integrate your provider (KavehNegar, Ghasedak, Twilio, etc.)
    this.logger.log(`SMS to ${phone}: Your verification code is ${code}`);
    return true;
  }
}

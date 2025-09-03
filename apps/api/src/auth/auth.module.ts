import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SmsService } from './sms/sms.service';
import { OtpService } from './otp/otp.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, SmsService, OtpService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}

import { Matches, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { OtpPurposeDto } from './request-otp.dto';

export class VerifyOtpDto {
  @Matches(/^\+989\d{9}$/)
  phone!: string;

  @Length(4, 4)
  @Matches(/^\d{4}$/)
  code!: string;

  // SIGNUP, LOGIN, or LINK_PHONE (but LINK_PHONE is handled on separate endpoints)
  @IsEnum(OtpPurposeDto)
  purpose!: OtpPurposeDto;

  // Only for first-time phone SIGNUP
  @IsOptional()
  @IsString()
  name?: string;
}

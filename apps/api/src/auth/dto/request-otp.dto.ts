import { IsEnum, Matches } from 'class-validator';

export enum OtpPurposeDto {
  SIGNUP = 'SIGNUP',
  LINK_PHONE = 'LINK_PHONE',
  LOGIN = 'LOGIN',
}

export class RequestOtpDto {
  // Iranian mobile like +98912xxxxxxx
  @Matches(/^\+989\d{9}$/, { message: 'Phone must be like +98912xxxxxxx' })
  phone!: string;

  @IsEnum(OtpPurposeDto)
  purpose!: OtpPurposeDto;
}

import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: "password must contain an uppercase letter" })
  @Matches(/[a-z]/, { message: "password must contain a lowercase letter" })
  @Matches(/\d/, { message: "password must contain a number" })
  password: string;
}

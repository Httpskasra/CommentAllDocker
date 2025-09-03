import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import type { Response } from 'express';
import { OtpPurpose } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

function setAuthCookies(res: Response, access: string, refresh: string) {
  res.cookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
  res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // ----- OTP -----
  @Post('request-otp')
  async requestOtp(@Body() dto: RequestOtpDto) {
    const { expiresAt } = await this.auth.requestOtp(dto.phone, dto.purpose as OtpPurpose);
    return { ok: true, expiresAt };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res() res: Response) {
    const { user, access, refresh, accessExpiresAt } =
    await this.auth.verifyOtpAndHandle(dto.phone, dto.purpose as OtpPurpose, dto.code, dto.name);
    setAuthCookies(res, access, refresh);
    return res.json({ user, accessExpiresAt });
  }

  // ----- Google OAuth (standard login) -----
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const { user, access, refresh, needsPhoneLink } = await this.auth.handleGoogleProfile(req.user);
    setAuthCookies(res, access, refresh);

    // Redirect your frontend to an appropriate page to link phone if needed
    const url = new URL(process.env.APP_URL || 'http://localhost:3000');
    url.pathname = needsPhoneLink ? '/link-phone' : '/';
    res.redirect(url.toString());
  }

  // ----- Link phone for Google-first users -----
  @UseGuards(JwtAuthGuard)
  @Post('link-phone/start')
  async linkPhoneStart(@Body('phone') phone: string, @Req() req: any) {
    const { expiresAt } = await this.auth.linkPhoneStart(req.user.sub, phone);
    return { ok: true, expiresAt };
  }

  @UseGuards(JwtAuthGuard)
  @Post('link-phone/verify')
  async linkPhoneVerify(@Body() body: { phone: string; code: string }, @Req() req: any) {
    await this.auth.linkPhoneVerify(req.user.sub, body.phone, body.code);
    return { ok: true };
  }
}

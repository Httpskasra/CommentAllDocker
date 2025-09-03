import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms/sms.service';
import { OtpService } from './otp/otp.service';
import { OtpPurpose } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { addSeconds } from 'date-fns';

const ACCESS_TTL = parseInt(process.env.JWT_ACCESS_TTL || '900', 10);      // 15m
const REFRESH_TTL = parseInt(process.env.JWT_REFRESH_TTL || '2592000', 10); // 30d

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private sms: SmsService,
    private otp: OtpService,
  ) {}

  // ---------- Tokens ----------
  private signAccess(userId: string) {
    return jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: ACCESS_TTL });
  }
  private async signRefresh(userId: string, ua?: string, ip?: string) {
    const raw = jwt.sign({ sub: userId, typ: 'refresh' }, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_TTL });
    const hash = await bcrypt.hash(raw, 10);
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: hash, userAgent: ua, ip },
    });
    return raw;
  }

  // ---------- OTP ----------
  async requestOtp(phone: string, purpose: OtpPurpose) {
    const { code, expiresAt } = await this.otp.issue(phone, purpose);
    await this.sms.sendOtp(phone, code);
    return { expiresAt };
  }

  // SIGNUP & LOGIN via phone (LINK_PHONE handled separately)
  async verifyOtpAndHandle(phone: string, purpose: OtpPurpose, code: string, name?: string) {
    await this.otp.verify(phone, purpose, code);

    if (purpose === 'SIGNUP') {
      let user = await this.prisma.user.findUnique({ where: { phone } });
      if (!user) {
        user = await this.prisma.user.create({
          data: { phone, phoneVerifiedAt: new Date(), name: name || 'User' },
        });
      } else if (!user.phoneVerifiedAt) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { phoneVerifiedAt: new Date() },
        });
      }

      await this.otp.invalidateAll(phone, 'SIGNUP');
      const access = this.signAccess(user.id);
      const refresh = await this.signRefresh(user.id);
      await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

      return {
        user,
        access,
        refresh,
        accessExpiresAt: addSeconds(new Date(), ACCESS_TTL),
      };
    }

    if (purpose === 'LOGIN') {
      const user = await this.prisma.user.findUnique({ where: { phone } });
      if (!user || !user.phoneVerifiedAt) {
        throw new BadRequestException('Phone is not verified. Use SIGNUP first.');
      }
      await this.otp.invalidateAll(phone, 'LOGIN');
      const access = this.signAccess(user.id);
      const refresh = await this.signRefresh(user.id);
      await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

      return {
        user,
        access,
        refresh,
        accessExpiresAt: addSeconds(new Date(), ACCESS_TTL),
      };
    }

    throw new BadRequestException('Unsupported purpose.');
  }

  // ---------- Google OAuth ----------
  // Called by /auth/google/callback (profile comes from GoogleStrategy)
  async handleGoogleProfile(p: { googleId: string; name?: string | null; email?: string | null }) {
    let user = await this.prisma.user.findUnique({ where: { googleId: p.googleId } });

    if (!user) {
      // Optionally: try to find by email if you ever store it (you removed email from schema)
      user = await this.prisma.user.create({
        data: { googleId: p.googleId, name: p.name || 'User' },
      });
    }

    const needsPhoneLink = !user.phoneVerifiedAt || !user.phone;

    const access = this.signAccess(user.id);
    const refresh = await this.signRefresh(user.id);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return { user, access, refresh, needsPhoneLink };
  }

  // ---------- Link phone for Google-first users ----------
  async linkPhoneStart(userId: string, phone: string) {
    const exists = await this.prisma.user.findUnique({ where: { phone } });
    if (exists) throw new BadRequestException('Phone already in use.');
    const { code, expiresAt } = await this.otp.issue(phone, 'LINK_PHONE');
    await this.sms.sendOtp(phone, code);
    return { expiresAt };
  }

  async linkPhoneVerify(userId: string, phone: string, code: string) {
    await this.otp.verify(phone, 'LINK_PHONE', code);
    await this.prisma.user.update({
      where: { id: userId },
      data: { phone, phoneVerifiedAt: new Date() },
    });
    await this.otp.invalidateAll(phone, 'LINK_PHONE');
    return { ok: true };
  }
}

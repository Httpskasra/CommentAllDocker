import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { addMinutes } from 'date-fns';
import { OtpPurpose } from '@prisma/client';

const OTP_TTL_MIN = 5;
const MAX_ISSUE_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  private generate4Digit(): string {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  async issue(phone: string, purpose: OtpPurpose) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await this.prisma.otpCode.count({
      where: { phone, purpose, createdAt: { gte: oneHourAgo } },
    });
    if (recent >= MAX_ISSUE_PER_HOUR) {
        throw new HttpException('Too many OTP requests. Try later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = this.generate4Digit();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = addMinutes(new Date(), OTP_TTL_MIN);

    await this.prisma.otpCode.create({
      data: { phone, purpose, codeHash, expiresAt },
    });

    return { code, expiresAt };
  }

  async verify(phone: string, purpose: OtpPurpose, code: string) {
    const rec = await this.prisma.otpCode.findFirst({
      where: { phone, purpose, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!rec) throw new BadRequestException('Code expired or not found.');

    if (rec.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException('Too many attempts.');
    }

    const ok = await bcrypt.compare(code, rec.codeHash);
    if (!ok) {
      await this.prisma.otpCode.update({
        where: { id: rec.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid code.');
    }

    await this.prisma.otpCode.update({
      where: { id: rec.id },
      data: { consumedAt: new Date() },
    });

    return true;
  }

  async invalidateAll(phone: string, purpose: OtpPurpose) {
    await this.prisma.otpCode.updateMany({
      where: { phone, purpose, consumedAt: null, expiresAt: { gt: new Date() } },
      data: { consumedAt: new Date() },
    });
  }
}

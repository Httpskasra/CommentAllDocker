import { Inject, Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { OtpPurpose } from '@prisma/client';
import type Redis from 'ioredis';

const OTP_TTL_SEC = 300;           // 5 min
const MAX_ISSUE_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  constructor(@Inject('REDIS') private redis: Redis) {}

  private code() { return String(Math.floor(1000 + Math.random() * 9000)); }
  private key(phone: string, purpose: OtpPurpose) { return `otp:${phone}:${purpose}`; }
  private attemptsKey(phone: string, purpose: OtpPurpose) { return `otp:${phone}:${purpose}:attempts`; }
  private issuedKey(phone: string, purpose: OtpPurpose) {
    const hour = new Date().toISOString().slice(0,13).replace(/[-:T]/g,'');
    return `otp:${phone}:${purpose}:issued:${hour}`;
  }

  async issue(phone: string, purpose: OtpPurpose) {
    const issuedKey = this.issuedKey(phone, purpose);
    const issued = Number(await this.redis.get(issuedKey) || 0);
    if (issued >= MAX_ISSUE_PER_HOUR) {
      throw new HttpException('Too many OTP requests. Try later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const raw = this.code();
    const hash = await bcrypt.hash(raw, 10);

    const key = this.key(phone, purpose);
    // SET with TTL (overwrite if exists)
    await this.redis.multi()
      .set(key, hash, 'EX', OTP_TTL_SEC)
      .incr(issuedKey)
      .expire(issuedKey, 3700) // ~1h + buffer
      .del(this.attemptsKey(phone, purpose)) // reset attempts on new issue
      .exec();

    return { code: raw, expiresAt: new Date(Date.now() + OTP_TTL_SEC * 1000) };
  }

  async verify(phone: string, purpose: OtpPurpose, code: string) {
    const key = this.key(phone, purpose);
    const hash = await this.redis.get(key);
    if (!hash) throw new BadRequestException('Code expired or not found.');

    const attemptsKey = this.attemptsKey(phone, purpose);
    const attempts = Number(await this.redis.get(attemptsKey) || 0);
    if (attempts >= MAX_ATTEMPTS) throw new BadRequestException('Too many attempts.');

    const ok = await bcrypt.compare(code, hash);
    if (!ok) {
      const tx = this.redis.multi().incr(attemptsKey);
      if (attempts === 0) {
        // set TTL same as otp key remaining
        const ttl = await this.redis.ttl(key);
        if (ttl > 0) tx.expire(attemptsKey, ttl);
      }
      await tx.exec();
      throw new BadRequestException('Invalid code.');
    }

    // success: delete otp + attempts
    await this.redis.multi().del(key).del(attemptsKey).exec();
    return true;
  }

  async invalidateAll(phone: string, purpose: OtpPurpose) {
    await this.redis.del(this.key(phone, purpose));
    await this.redis.del(this.attemptsKey(phone, purpose));
  }
}

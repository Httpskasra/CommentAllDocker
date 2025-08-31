// auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  private signTokens(payload: any) {
    const accessToken = this.jwt.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async register(email: string, username: string, password: string) {
    const exist = await this.users.findByEmail(email) || await this.users.findByUsername(username);
    if (exist) throw new BadRequestException('Email or username already exists');
    const passwordHash = await argon2.hash(password);
    const user = await this.users.createUser({ email, username, passwordHash });
    const { id, role } = user;
    return { user: { id, email, username, role }, ...this.signTokens({ sub: id, role }) };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const { id, role, username } = user;
    return { user: { id, email, username, role }, ...this.signTokens({ sub: id, role }) };
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.users.findByEmail(payload.email ?? '');
      // یا می‌تونی با sub=id پیدا کنی (ترجیحاً sub)
      return this.signTokens({ sub: payload.sub, role: payload.role });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

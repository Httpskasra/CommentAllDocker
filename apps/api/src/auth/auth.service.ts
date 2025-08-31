import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  private signTokens(user: { id: string; email: string; role?: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_me",
      expiresIn: "15m",
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me",
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  private sanitize(user: any) {
    if (!user) return user;
    const { passwordHash, ...clean } = user;
    return clean;
  }

  async register(email: string, username: string, password: string) {
    const byEmail = await this.users.findByEmail(email);
    if (byEmail) throw new BadRequestException("Email already in use");

    const byUsername = await this.users.findByUsername(username);
    if (byUsername) throw new BadRequestException("Username already in use");

    const passwordHash = await argon2.hash(password);
    const user = await this.users.create({ email, username, passwordHash });
    const tokens = this.signTokens({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });

    return { user: this.sanitize(user), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const tokens = this.signTokens({
      id: user.id,
      email: user.email,
      role: user.role as any,
    });
    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me",
      });
      const tokens = this.signTokens({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      });
      return tokens;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}

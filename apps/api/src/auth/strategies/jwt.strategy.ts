import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type JwtPayload = { sub: string; role?: string; email?: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_me",
    });
  }

  async validate(payload: JwtPayload) {
    // هر چیزی که اینجا return بشه توی req.user در دسترسه
    return { userId: payload.sub, role: payload.role, email: payload.email };
  }
}

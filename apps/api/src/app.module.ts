import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [PrismaModule, UsersModule, RedisModule, AuthModule],
})
export class AppModule {}
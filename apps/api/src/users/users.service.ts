// users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: { email: string; username: string; passwordHash: string }) {
    try {
      return await this.prisma.user.create({ data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email or username already exists');
      }
      throw e;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async updateName(userId: string, name: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { name } });
  }
}

  // Optional: temporary stubs to avoid breaking callers
  // Remove these if nothing calls them anymore.
//   async findByEmail(_email: string) {
//     return null;
//   }
//   async findByUsername(_username: string) {
//     return null;
//   }
// }

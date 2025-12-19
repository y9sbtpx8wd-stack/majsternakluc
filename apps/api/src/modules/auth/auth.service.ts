import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new BadRequestException('Email exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );

    return { user, token };
  }
}


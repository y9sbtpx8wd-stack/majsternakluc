import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { MailService } from '../mail/mail.service'; // 🔥 DOPLNENÝ IMPORT
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService, // 🔥 DOPLNENÉ
  ) {}

  // -------------------------
  // REGISTER
  // -------------------------
  async register(dto: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new BadRequestException('Email exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName ?? null,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: 'user',

        // 🔥 emailVerified default
        emailVerified: false,

        // 🔥 refreshToken placeholder
        refreshToken: null,
      },
    });

    // 🔥 email verification token
    const emailToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_EMAIL_SECRET!,
      { expiresIn: '1d' }
    );

    // 🔥 odoslanie emailu
    await this.mailService.sendVerificationEmail(user.email, emailToken);

    return {
      user,
      accessToken: this.signAccessToken(user.id),
      refreshToken: this.signRefreshToken(user.id),
      emailToken,
    };
  }

  // -------------------------
  // LOGIN
  // -------------------------
  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new BadRequestException('Invalid credentials');

    // 🔥 email verification check
    if (!user.emailVerified) {
      throw new BadRequestException('Email not verified');
    }

    const refreshToken = this.signRefreshToken(user.id);

    // 🔥 uloženie refresh tokenu
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user,
      accessToken: this.signAccessToken(user.id),
      refreshToken,
    };
  }

  // -------------------------
  // REFRESH TOKEN
  // -------------------------
  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      const userId = payload.sub;

      // 🔥 kontrola refresh tokenu v DB
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.refreshToken !== refreshToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const newRefresh = this.signRefreshToken(userId);

      // 🔥 uloženie nového refresh tokenu
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: newRefresh },
      });

      return {
        accessToken: this.signAccessToken(userId),
        refreshToken: newRefresh,
      };
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  // -------------------------
  // EMAIL VERIFICATION
  // -------------------------
  async verifyEmail(token: string) {
    const payload = jwt.verify(token, process.env.JWT_EMAIL_SECRET!) as any;

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { emailVerified: true },
    });

    return { success: true };
  }

  // -------------------------
  // PASSWORD RESET
  // -------------------------
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true };

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_RESET_SECRET!,
      { expiresIn: '15m' },
    );

    // 🔥 odoslanie reset emailu
    await this.mailService.sendPasswordResetEmail(user.email, token);

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = jwt.verify(token, process.env.JWT_RESET_SECRET!) as any;

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash },
    });

    return { success: true };
  }

  // -------------------------
  // TOKEN HELPERS
  // -------------------------
  private signAccessToken(userId: string) {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
  }

  private signRefreshToken(userId: string) {
    return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
  }
}
async resendVerification(email: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) return { success: true }; // nechceme prezrádzať, či email existuje

  if (user.emailVerified) return { success: true };

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_EMAIL_SECRET!,
    { expiresIn: '1d' }
  );

  await this.mailService.sendVerificationEmail(user.email, token);

  return { success: true };
}
function resendVerification(email: any, string: any) {
  throw new Error('Function not implemented.');
}


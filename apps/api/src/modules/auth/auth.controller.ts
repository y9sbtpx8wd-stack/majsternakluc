import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password,
      dto.phone,
    );
  }

  @Post('login')
  login(@Body() dto: { email: string; password: string }) {
    return this.auth.login(dto.email, dto.password);
  }
}


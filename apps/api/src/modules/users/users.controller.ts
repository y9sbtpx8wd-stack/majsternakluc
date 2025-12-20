import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // Public
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // Protected: GET /users/me
  @Get('me/profile')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: any) {
    return this.userService.findOne(user.sub);
  }

  // Protected: GET /users/me/listings
  @Get('me/listings')
  @UseGuards(AuthGuard)
  myListings(@CurrentUser() user: any) {
    return this.userService.myListings(user.sub);
  }

  // Protected: PATCH /users/me
  @Patch('me')
  @UseGuards(AuthGuard)
  updateMe(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.update(user.sub, dto);
  }
}

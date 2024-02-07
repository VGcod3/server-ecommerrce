import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') profileId: number) {
    return this.userService.byId(profileId);
  }

  @Auth()
  @Put('profile')
  async updateProfile(@Body() dto: UserDto, @CurrentUser('id') id: number) {
    return this.userService.updateProfile(id, dto);
  }

  @Auth()
  @Delete('profile')
  async deleteProfile(@CurrentUser('id') userId: number) {
    return this.userService.deleteProfile(userId);
  }

  @Patch('profile/favorites/:productId')
  @Auth()
  async toggleFavorite(
    @Param('productId') productId: string,
    @CurrentUser('id') userId: number,
  ) {
    return this.userService.toggleFavorite(userId, +productId);
  }
}

import { Controller, Get, Patch, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private extractToken(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    return authHeader.split(' ')[1];
  }

  @Get('profile')
  getProfile(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    return this.userService.getProfile(token);
  }

  @Patch('profile')
  updateProfile(@Headers('authorization') authHeader: string, @Body() updateProfileDto: UpdateProfileDto) {
    const token = this.extractToken(authHeader);
    return this.userService.updateProfile(token, updateProfileDto);
  }

  @Post('change-password')
  changePassword(@Headers('authorization') authHeader: string, @Body() changePasswordDto: ChangePasswordDto) {
    const token = this.extractToken(authHeader);
    return this.userService.changePassword(token, changePasswordDto);
  }

  @Get('logs')
  getLoginLogs(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    return this.userService.getLoginLogs(token);
  }
}

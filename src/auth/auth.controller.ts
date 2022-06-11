import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { GetUserDto } from './dtos/GetUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @HttpCode(200)
  signIn(@Body() getUserDto: GetUserDto) {
    return this.authService.signIn(getUserDto);
  }
}

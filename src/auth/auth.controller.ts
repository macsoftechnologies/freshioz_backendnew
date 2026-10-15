import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, PartnerLoginDto } from './dto/register.dto';
import { AuthResponseSchema } from './schemas/auth-response.schema';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login with email/phone & password and receive JWT Bearer token' })
  @ApiResponse({ status: 200, description: 'Authentication successful', type: AuthResponseSchema })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiResponse({ status: 201, description: 'Registration successful', type: AuthResponseSchema })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Society partner secretary portal login' })
  @ApiResponse({ status: 200, description: 'Partner authentication successful', type: AuthResponseSchema })
  @Post('partner-login')
  async partnerLogin(@Body() body: PartnerLoginDto) {
    return this.authService.partnerLogin(body);
  }

  @ApiOperation({ summary: 'Validate current session token' })
  @ApiBearerAuth()
  @Get('login')
  async verifySession(@Headers('authorization') authHeader?: string) {
    return this.authService.verifyToken(authHeader);
  }
}

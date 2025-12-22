import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async register(authDto: AuthDto) {
    const { email, password } = authDto;
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email,
        password,
      });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async login(authDto: AuthDto, ip?: string, userAgent?: string) {
    const { email, password } = authDto;
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // Log login
    if (data.user) {
        await this.supabaseService
            .getClient()
            .from('login_logs')
            .insert({
                user_id: data.user.id,
                ip_address: ip,
                device: userAgent
            });
    }

    return data;
  }
}

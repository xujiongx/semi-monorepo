import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async getUser(token: string) {
    const { data: { user }, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async getProfile(token: string) {
    const user = await this.getUser(token);
    
    // Get profile from public table
    const { data: profile, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    // If profile doesn't exist (e.g. old user), return basic auth info
    if (error && error.code === 'PGRST116') {
        return {
            id: user.id,
            email: user.email,
            nickname: user.user_metadata?.nickname || '',
            avatar_url: '',
        };
    }

    if (error) throw new BadRequestException(error.message);

    return { ...profile, email: user.email };
  }

  async updateProfile(token: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.getUser(token);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('profiles')
      .upsert({ id: user.id, ...updateProfileDto }) // upsert in case profile missing
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async changePassword(token: string, changePasswordDto: ChangePasswordDto) {
    const { error } = await this.supabaseService
      .getClient()
      .auth.updateUser({ password: changePasswordDto.password }); // This might require admin client if using service role, but typically requires user token

    // Wait, updateUser with service_role key changes the user passed in params? No, updateUser updates the user associated with the client.
    // If we use `supabase.auth.admin.updateUserById`, we need ID.
    // If we use `supabase.auth.updateUser`, it uses the logged in session. 
    // Since `this.supabaseService.getClient()` is initialized with `SUPABASE_KEY` (service role likely), 
    // it acts as admin. But `updateUser` on a generic client might not work as intended for a specific user unless we scope it.
    
    // BETTER APPROACH:
    // Create a temporary client with the user's token to perform actions on their behalf.
    // Or use `admin.updateUserById`.
    
    const user = await this.getUser(token);
    const { error: updateError } = await this.supabaseService
        .getClient()
        .auth.admin.updateUserById(user.id, { password: changePasswordDto.password });

    if (updateError) throw new BadRequestException(updateError.message);

    return { success: true };
  }

  async getLoginLogs(token: string) {
    const user = await this.getUser(token);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('login_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('login_at', { ascending: false })
      .limit(20);

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}

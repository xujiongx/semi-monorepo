import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MilestoneService {
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

  async create(token: string, createMilestoneDto: CreateMilestoneDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('milestones')
      .insert({
        ...createMilestoneDto,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findAll(token: string) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('milestones')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findOne(token: string, id: string) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('milestones')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(token: string, id: string, updateMilestoneDto: UpdateMilestoneDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('milestones')
      .update(updateMilestoneDto)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async remove(token: string, id: string) {
    const user = await this.getUser(token);
    const { error } = await this.supabaseService
      .getClient()
      .from('milestones')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { success: true };
  }
}

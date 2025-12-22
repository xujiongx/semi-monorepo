import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ResourcesService {
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

  async create(token: string, createResourceDto: CreateResourceDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('resources')
      .insert({
        ...createResourceDto,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findAll(token: string, query?: { type?: string; tags?: string; search?: string }) {
    const user = await this.getUser(token);
    let builder = this.supabaseService
      .getClient()
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (query?.type) {
      builder = builder.eq('type', query.type);
    }
    if (query?.tags) {
        // Assuming tags is passed as comma separated string for simple filtering or single tag
        // Supabase array filtering using 'cs' (contains)
        builder = builder.contains('tags', [query.tags]);
    }
    if (query?.search) {
        builder = builder.ilike('filename', `%${query.search}%`);
    }

    const { data, error } = await builder;

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findOne(token: string, id: string) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('resources')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(token: string, id: string, updateResourceDto: UpdateResourceDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('resources')
      .update(updateResourceDto)
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
      .from('resources')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { success: true };
  }

  async batchRemove(token: string, ids: string[]) {
    const user = await this.getUser(token);
    const { error } = await this.supabaseService
        .getClient()
        .from('resources')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id);
    
    if (error) {
        throw new BadRequestException(error.message);
    }
    return { success: true };
  }
}

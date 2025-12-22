import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CategoryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async getUser(token: string) {
    const {
      data: { user },
      error,
    } = await this.supabaseService.getClient().auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async create(token: string, createCategoryDto: CreateCategoryDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .insert({ ...createCategoryDto, user_id: user.id })
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
      .from('categories')
      .select('*, articles(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Transform count
    return data.map((item: any) => ({
      ...item,
      count: item.articles ? item.articles[0]?.count : 0,
    }));
  }

  async findOne(token: string, id: string) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(
    token: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .update(updateCategoryDto)
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
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { success: true };
  }
}

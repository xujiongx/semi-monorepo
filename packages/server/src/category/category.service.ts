import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CategoryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .insert(createCategoryDto)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .select('*, articles(count)')
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

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .update(updateCategoryDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { success: true };
  }
}

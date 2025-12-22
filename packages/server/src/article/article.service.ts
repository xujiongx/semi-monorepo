import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ArticleService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createArticleDto: CreateArticleDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .insert(createArticleDto)
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
      .from('articles')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(error.message);
    }
    
    // Transform category name
    return data.map((item: any) => ({
        ...item,
        category: item.categories?.name
    }));
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .update(updateArticleDto)
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
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { success: true };
  }
}

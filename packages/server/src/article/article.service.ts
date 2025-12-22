import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ArticleService {
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

  async create(token: string, createArticleDto: CreateArticleDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .insert({
        ...createArticleDto,
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
      .from('articles')
      .select('*, categories(name)')
      .eq('user_id', user.id)
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

  async findOne(token: string, id: string) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async update(token: string, id: string, updateArticleDto: UpdateArticleDto) {
    const user = await this.getUser(token);
    const { data, error } = await this.supabaseService
      .getClient()
      .from('articles')
      .update(updateArticleDto)
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
      .from('articles')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new BadRequestException(error.message);
    }
    return { success: true };
  }
}

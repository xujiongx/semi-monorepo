import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UnauthorizedException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  private extractToken(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    return authHeader.split(' ')[1];
  }

  @Post()
  create(@Headers('authorization') authHeader: string, @Body() createArticleDto: CreateArticleDto) {
    const token = this.extractToken(authHeader);
    return this.articleService.create(token, createArticleDto);
  }

  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    return this.articleService.findAll(token);
  }

  @Get(':id')
  findOne(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const token = this.extractToken(authHeader);
    return this.articleService.findOne(token, id);
  }

  @Patch(':id')
  update(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    const token = this.extractToken(authHeader);
    return this.articleService.update(token, id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const token = this.extractToken(authHeader);
    return this.articleService.remove(token, id);
  }
}

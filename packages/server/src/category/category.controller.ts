import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private extractToken(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    return authHeader.split(' ')[1];
  }

  @Post()
  create(@Headers('authorization') authHeader: string, @Body() createCategoryDto: CreateCategoryDto) {
    const token = this.extractToken(authHeader);
    return this.categoryService.create(token, createCategoryDto);
  }

  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader);
    return this.categoryService.findAll(token);
  }

  @Get(':id')
  findOne(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const token = this.extractToken(authHeader);
    return this.categoryService.findOne(token, id);
  }

  @Patch(':id')
  update(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const token = this.extractToken(authHeader);
    return this.categoryService.update(token, id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const token = this.extractToken(authHeader);
    return this.categoryService.remove(token, id);
  }
}

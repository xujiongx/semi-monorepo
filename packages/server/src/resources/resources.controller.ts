import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(@Headers('authorization') token: string, @Body() createResourceDto: CreateResourceDto) {
    const accessToken = token.replace('Bearer ', '');
    return this.resourcesService.create(accessToken, createResourceDto);
  }

  @Get()
  findAll(
    @Headers('authorization') token: string,
    @Query('type') type?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
  ) {
    const accessToken = token.replace('Bearer ', '');
    return this.resourcesService.findAll(accessToken, { type, tags, search });
  }

  @Get(':id')
  findOne(@Headers('authorization') token: string, @Param('id') id: string) {
    const accessToken = token.replace('Bearer ', '');
    return this.resourcesService.findOne(accessToken, id);
  }

  @Patch(':id')
  update(@Headers('authorization') token: string, @Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    const accessToken = token.replace('Bearer ', '');
    return this.resourcesService.update(accessToken, id, updateResourceDto);
  }

  @Delete('batch')
  batchRemove(@Headers('authorization') token: string, @Body('ids') ids: string[]) {
      const accessToken = token.replace('Bearer ', '');
      return this.resourcesService.batchRemove(accessToken, ids);
  }

  @Delete(':id')
  remove(@Headers('authorization') token: string, @Param('id') id: string) {
    const accessToken = token.replace('Bearer ', '');
    return this.resourcesService.remove(accessToken, id);
  }
}

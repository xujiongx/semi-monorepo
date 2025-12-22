import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Post()
  create(@Headers('authorization') token: string, @Body() createMilestoneDto: CreateMilestoneDto) {
    const accessToken = token.replace('Bearer ', '');
    return this.milestoneService.create(accessToken, createMilestoneDto);
  }

  @Get()
  findAll(@Headers('authorization') token: string) {
    const accessToken = token.replace('Bearer ', '');
    return this.milestoneService.findAll(accessToken);
  }

  @Get(':id')
  findOne(@Headers('authorization') token: string, @Param('id') id: string) {
    const accessToken = token.replace('Bearer ', '');
    return this.milestoneService.findOne(accessToken, id);
  }

  @Patch(':id')
  update(@Headers('authorization') token: string, @Param('id') id: string, @Body() updateMilestoneDto: UpdateMilestoneDto) {
    const accessToken = token.replace('Bearer ', '');
    return this.milestoneService.update(accessToken, id, updateMilestoneDto);
  }

  @Delete(':id')
  remove(@Headers('authorization') token: string, @Param('id') id: string) {
    const accessToken = token.replace('Bearer ', '');
    return this.milestoneService.remove(accessToken, id);
  }
}

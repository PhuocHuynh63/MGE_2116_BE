import { Controller, Post, Body } from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultService.create(createResultDto);
  }
}

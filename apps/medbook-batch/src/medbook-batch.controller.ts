import { Controller, Get } from '@nestjs/common';
import { MedbookBatchService } from './medbook-batch.service';

@Controller()
export class MedbookBatchController {
  constructor(private readonly medbookBatchService: MedbookBatchService) {}

  @Get()
  getHello(): string {
    return this.medbookBatchService.getHello();
  }
}

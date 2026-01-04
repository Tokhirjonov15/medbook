import { Module } from '@nestjs/common';
import { MedbookBatchController } from './medbook-batch.controller';
import { MedbookBatchService } from './medbook-batch.service';

@Module({
  imports: [],
  controllers: [MedbookBatchController],
  providers: [MedbookBatchService],
})
export class MedbookBatchModule {}

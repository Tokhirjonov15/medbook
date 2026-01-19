import { Module } from '@nestjs/common';
import { MedbookBatchController } from './medbook-batch.controller';
import { MedbookBatchService } from './medbook-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule.forRoot()],
	controllers: [MedbookBatchController],
	providers: [MedbookBatchService],
})
export class MedbookBatchModule {}

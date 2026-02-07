import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_DOCTORS } from './lib/config';

@Controller()
export class BatchController {
	private logger: Logger = new Logger('BatchController');
	constructor(private readonly batchService: BatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY');
	}

	// @Cron('*/20 * * * * *', { name: 'CRON_TEST' })
	// public cronTest() {
	// 	this.logger['context'] = 'CRON_TEST';
	// 	this.logger.debug('EXECUTED!');
	// }

	@Cron('20 * * * * *', { name: BATCH_TOP_DOCTORS })
	public async batchDoctors() {
		try {
			this.logger['context'] = BATCH_TOP_DOCTORS;
			this.logger.debug('EXECUTED!');
			await this.batchService.batchDoctors();
		} catch (err) {
			this.logger.error(err);
		}
	}

	/**
	@Interval(1000)
	handleInterval() {
		this.logger.debug('INTERVAL TEST');
	}
	*/

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
	public async batchRollback(): Promise<void> {
		console.log('batchRollback');
	}

	public async batchDoctors(): Promise<void> {
		console.log('batchDoctors');
	}

	getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}

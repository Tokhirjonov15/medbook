import { Injectable } from '@nestjs/common';

@Injectable()
export class MedbookBatchService {
  getHello(): string {
    return 'Welcome to Medbook batch API Server!';
  }
}

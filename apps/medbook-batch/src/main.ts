import { NestFactory } from '@nestjs/core';
import { MedbookBatchModule } from './medbook-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(MedbookBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

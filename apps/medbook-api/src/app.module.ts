import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppResolver } from './app.resolver';
import { ApolloDriver } from "@nestjs/apollo";
import { GraphQLModule } from '@nestjs/graphql';

@Module({
	imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      autoSchemaFile: true,
    }),
  ],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}

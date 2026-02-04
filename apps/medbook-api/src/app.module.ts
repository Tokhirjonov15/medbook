import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppResolver } from './app.resolver';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { SocketModule } from './socket/socket.module';
import { T } from './libs/types/common';

@Module({
	imports: [
		ConfigModule.forRoot(),
		GraphQLModule.forRoot({
			driver: ApolloDriver,
			playground: true,
			uploads: false,
			autoSchemaFile: true,
			formatError: (error: T) => {
				console.log('Error:', error);
				const graphQLFormatError = {
					code: error?.extensions.code,
					message:
						error?.extensions?.exception?.response?.message || error?.extension?.response?.message || error?.message,
				};
				console.log('GRAPHQL GLOBAL ERR:', graphQLFormatError);
				return graphQLFormatError;
			},
		}),
		ComponentsModule,
		DatabaseModule,
		SocketModule
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}

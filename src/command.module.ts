import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration, GlobalConfigType, validationSchema } from './confing';
import { FirestoreModule } from './modules/firestore';
import { ApiFootBallModule } from './modules/api-football';
import { SyncModule } from './modules/syncs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema,
    }),
    FirestoreModule.registerAsync({
      global: true,
      useFactory: (config: GlobalConfigType) => ({
        serviceAccount: {
          projectId: config.FIRESTORE_PROJECT_ID,
          privateKey: config.FIRESTORE_PRIVATE_KEY,
          clientEmail: config.FIRESTORE_CLIENT_EMAIL,
        },
      }),
      inject: [configuration.KEY],
    }),
    ApiFootBallModule.registerAsync({
      useFactory(config: GlobalConfigType) {
        return {
          key: config.API_FOOTBALL_KEY,
          host: config.API_FOOTBALL_HOST,
        };
      },
      inject: [configuration.KEY],
    }),
    ApiFootBallModule.registerAsync({
      global: true,
      useFactory(config: GlobalConfigType) {
        return {
          key: config.API_FOOTBALL_KEY,
          host: config.API_FOOTBALL_HOST,
        };
      },
      inject: [configuration.KEY],
    }),
    SyncModule,
  ],
})
export class CommandModule {}

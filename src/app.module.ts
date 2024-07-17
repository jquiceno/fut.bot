import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NestjsGrammyModule } from '@grammyjs-nest';
import { ApiFootBallModule } from '@api-football';

import { BotModule, BOT_NAME } from './modules/bot';
import { validationSchema, configuration, GlobalConfigType } from './confing';
import { AppController } from './app.controller';
import { FirestoreModule } from './modules/firestore';
import { SyncModule } from './modules/syncs';

export class LogService extends ConsoleLogger {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema,
    }),
    NestjsGrammyModule.forRootAsync({
      inject: [configuration.KEY],
      botName: BOT_NAME,
      useFactory: (config: GlobalConfigType) => {
        return {
          token: config.TELEGRAM_BOT_KEY,
          // options: { botInfo: {} },
          useWebhook: true,
          include: [BotModule],
        };
      },
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
      global: true,
      useFactory(config: GlobalConfigType) {
        return {
          key: config.API_FOOTBALL_KEY,
          host: config.API_FOOTBALL_HOST,
        };
      },
      inject: [configuration.KEY],
    }),
    BotModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [LogService],
  exports: [LogService],
})
export class AppModule {}

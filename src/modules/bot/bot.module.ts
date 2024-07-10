import { Module, NestModule, Logger, MiddlewareConsumer, Inject } from '@nestjs/common';
import { GlobalConfigType, configuration } from '../../confing/';
import { ApiFootBallModule } from '../api-football';
import { FirestoreModule } from '../firestore';
import * as Controllers from './controllers';
import { InjectBot, NestjsGrammyModule } from '@grammyjs-nest';
import { Bot, Context, webhookCallback } from 'grammy';
import { ResponseTime } from './middleware';
import { WebhookUpdater } from './update';
import { sessionMiddleware } from './middleware/session.middleware';
import { UpdateEvents } from './update-events.listener';
import { ApiService } from './api.service';
import { MatchPredictionScene } from './wizard';

const log = new Logger('bot:firebase-bot.module');

@Module({
  imports: [
    FirestoreModule.registerAsync({
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
    NestjsGrammyModule.forRootAsync({
      inject: [configuration.KEY],
      useFactory: (config: GlobalConfigType) => {
        return {
          botName: 'DonEdgarBot',
          token: config.TELEGRAM_BOT_KEY,
          useWebhook: true,
          include: [BotModule],
        };
      },
    }),
  ],
  providers: [WebhookUpdater, UpdateEvents, ApiService, MatchPredictionScene],
  controllers: [...Object.values(Controllers)],
})
export class BotModule implements NestModule {
  constructor(
    @InjectBot('DonEdgarBot')
    private readonly bot: Bot<Context>,
    @Inject(configuration.KEY)
    private readonly config: GlobalConfigType,
  ) {
    log.debug(`${BotModule.name} created`);
  }

  async configure(consumer: MiddlewareConsumer) {
    this.bot.use(sessionMiddleware);
    this.bot.use(ResponseTime);

    const webhookRoute = '/bot';
    this.bot.api.setWebhook(`${this.config.TELEGRAM_WEBHOOK_URL}${webhookRoute}`);
    consumer.apply(webhookCallback(this.bot, 'express')).forRoutes(webhookRoute);
  }
}

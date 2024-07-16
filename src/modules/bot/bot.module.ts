import { Module, NestModule, Logger, MiddlewareConsumer, Inject } from '@nestjs/common';
import { InjectBot } from '@grammyjs-nest';
import { Bot, Context, webhookCallback } from 'grammy';

import { GlobalConfigType, configuration } from '../../confing/';
import * as Controllers from './controllers';
import { ResponseTime } from './middleware';
import { WebhookUpdater } from './update';
import { sessionMiddleware } from './middleware/session.middleware';
import { UpdateEvents } from './update-events.listener';
import { ApiService } from './api.service';
import { MatchPredictionScene } from './wizard';
import { BOT_NAME } from './constants';

const log = new Logger('bot:firebase-bot.module');

function setMyCommands(bot: Bot<Context>, commands, languageCode) {
  return bot.api.setMyCommands(commands, { language_code: languageCode });
}

@Module({
  providers: [WebhookUpdater, UpdateEvents, ApiService, MatchPredictionScene],
  controllers: [...Object.values(Controllers)],
})
export class BotModule implements NestModule {
  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Bot<Context>,
    @Inject(configuration.KEY)
    private readonly config: GlobalConfigType,
  ) {
    log.debug(`${BotModule.name} created`);
  }

  async configure(consumer: MiddlewareConsumer) {
    this.bot.use(sessionMiddleware);
    this.bot.use(ResponseTime);

    const commandsEs = [
      {
        command: 'partidos',
        description: 'Mostrar partidos de hoy',
      },
      {
        command: 'adivine',
        description: 'Mostrar predicción de un partido',
      },
      {
        command: 'start',
        description: 'Iniciar configuración',
      },
      {
        command: `settimezone {country name}`,
        description: 'Configurar zona horaria por país',
      },
    ];

    await setMyCommands(this.bot, commandsEs, 'es');

    const webhookRoute = '/bot';
    await this.bot.api.setWebhook(`${this.config.TELEGRAM_WEBHOOK_URL}${webhookRoute}`);

    consumer.apply(webhookCallback(this.bot, 'express')).forRoutes(webhookRoute);
  }
}

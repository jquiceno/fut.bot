import { Module } from '@nestjs/common';
import { UpdateEvents } from './update-events.listener';
import { EchoService } from './bot.service';
import { GreeterUpdate } from './greeter/greeter.update';
import { RandomNumberScene } from './greeter/scenes/random-number.scene';
import { GreeterWizard } from './greeter/wizard/greeter.wizard';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './greeter/session.middleware';
import { GlobalConfigType, configuration } from '../../confing/';
import { ApiService } from './api.service';
import { MatchPredictionsWizard } from './wizard';
import { ApiFootBallModule } from '../api-football';
import { FirestoreModule } from '../firestore';

@Module({
  imports: [
    FirestoreModule.registerAsync({
      useFactory: (config: GlobalConfigType) => {
        console.log('config', config);
        return {
          serviceAccount: {
            projectId: config.FIRESTORE_PROJECT_ID,
            privateKey: config.FIRESTORE_PRIVATE_KEY,
            clientEmail: config.FIRESTORE_CLIENT_EMAIL,
          },
        };
      },
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
    TelegrafModule.forRootAsync({
      useFactory: (config: GlobalConfigType) => ({
        botName: 'DonEdgarBot',
        token: config.TELEGRAM_BOT_KEY,
        include: [BotModule],
        middlewares: [sessionMiddleware],
      }),
      inject: [configuration.KEY],
    }),
    BotModule,
  ],
  providers: [
    UpdateEvents,
    EchoService,
    GreeterUpdate,
    RandomNumberScene,
    GreeterWizard,
    ApiService,
    MatchPredictionsWizard,
  ],
})
export class BotModule {}

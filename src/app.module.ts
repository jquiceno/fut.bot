import { ConsoleLogger, Module } from '@nestjs/common';
import { BotModule } from './modules/bot';
import { ConfigModule } from '@nestjs/config';
import { validationSchema, configuration, GlobalConfigType } from './confing';
import { AppController } from './app.controller';
import { NestjsGrammyModule } from '@grammyjs-nest';

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
      botName: 'DonEdgarBot',
      useFactory: (config: GlobalConfigType) => {
        return {
          token: config.TELEGRAM_BOT_KEY,
          // options: { botInfo: {} },
          useWebhook: true,
          include: [BotModule],
        };
      },
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [LogService],
  exports: [LogService],
})
export class AppModule {}

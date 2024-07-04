import { Module } from "@nestjs/common";
import { UpdateEvents } from "./update-events.listener";
import { EchoService } from "./bot.service";
import { GreeterUpdate } from "./greeter/greeter.update";
import { RandomNumberScene } from "./greeter/scenes/random-number.scene";
import { GreeterWizard } from "./greeter/wizard/greeter.wizard";
import { TelegrafModule } from "nestjs-telegraf";
import { sessionMiddleware } from "./greeter/session.middleware";
import { GlobalConfigType, configuration } from "../../confing/";
import { ApiService } from "./api.service";
import { MatchPredictionsWizard } from "./wizard";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory(config: GlobalConfigType) {
        return {
          botName: "DonEdgarBot",
          token: config.TELEGRAM_BOT_KEY,
          include: [BotModule],
          middlewares: [sessionMiddleware],
        };
      },
      inject: [configuration.KEY],
    }),
    BotModule,
  ],
  providers: [
    {
      provide: "API_HEADERS",
      useFactory(config: GlobalConfigType) {
        return {
          "x-rapidapi-key": config.API_FOOTBALL_KEY,
          "x-rapidapi-host": config.API_FOOTBALL_HOST,
        };
      },
      inject: [configuration.KEY],
    },
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

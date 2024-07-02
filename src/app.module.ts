import { ConsoleLogger, Module } from "@nestjs/common";
import { BotModule } from "./modules/bot";
import { ConfigModule } from "@nestjs/config";
import { validationSchema, configuration } from "./confing";
import { AppController } from "./app.controller";

export class LogService extends ConsoleLogger {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema,
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [LogService],
  exports: [LogService],
})
export class AppModule {}

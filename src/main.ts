import { NestFactory } from '@nestjs/core';
import { AppModule, LogService } from './app.module';
import { configuration, GlobalConfigType } from './confing';

let logger: LogService;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LogService(),
  });

  const config = await app.resolve<GlobalConfigType>(configuration.KEY);
  logger = await app.resolve<LogService>(LogService);

  await app.listen(config.PORT);

  logger.log(`🚀 Server is listening on port ${config.PORT}`);
}

bootstrap().catch((error): void => {
  logger.error(`🔥 Error starting server, ${error}`);
  process.exit();
});

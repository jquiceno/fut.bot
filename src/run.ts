import { CommandFactory } from 'nest-commander';

import { CommandModule } from './command.module';

async function bootstrap(): Promise<void> {
  await CommandFactory.run(CommandModule, ['warn', 'error']);
  process.exit();
}

bootstrap().catch((e): void => {
  console.error(`🔥 Error running commands, ${e}`);
  process.exit(1);
});

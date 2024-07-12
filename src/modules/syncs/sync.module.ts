import { Module } from '@nestjs/common';
import * as Commands from './commands';
import * as SubCommands from './sub-commands';
import * as Services from './services';

@Module({
  providers: [...Object.values(Commands), ...Object.values(SubCommands), ...Object.values(Services)],
})
export class SyncModule {}

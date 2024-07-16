import { Command, CommandRunner } from 'nest-commander';
import { SyncLeaguesSubCommand, SyncMatchesSubCommand } from '../sub-commands';
import { Injectable } from '@nestjs/common';

@Command({
  name: 'sync',
  subCommands: [SyncMatchesSubCommand, SyncLeaguesSubCommand],
})
@Injectable()
export class SyncCommand extends CommandRunner {
  constructor() {
    super();
  }
  async run(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

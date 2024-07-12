import { Command, CommandRunner } from 'nest-commander';
import { SyncMatchesSubCommand } from '../sub-commands';
import { Injectable } from '@nestjs/common';

@Command({
  name: 'sync',
  subCommands: [SyncMatchesSubCommand],
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

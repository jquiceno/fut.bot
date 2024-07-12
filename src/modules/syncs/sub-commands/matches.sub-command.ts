import { CommandRunner, SubCommand } from 'nest-commander';
import * as dayJs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

import { SyncMatchesService } from '../services';

@SubCommand({ name: 'matches' })
export class SyncMatchesSubCommand extends CommandRunner {
  constructor(private readonly syncMatches: SyncMatchesService) {
    super();
  }

  async run(): Promise<void> {
    return this.syncMatches.run();
  }
}

import { CommandRunner, SubCommand } from 'nest-commander';

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

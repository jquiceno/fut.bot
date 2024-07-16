import { CommandRunner, SubCommand } from 'nest-commander';

import { SyncLeaguesService } from '../services';

@SubCommand({ name: 'leagues' })
export class SyncLeaguesSubCommand extends CommandRunner {
  constructor(private readonly syncLeagues: SyncLeaguesService) {
    super();
  }

  async run(): Promise<void> {
    return this.syncLeagues.run();
  }
}

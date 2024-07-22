import { CommandRunner, SubCommand } from 'nest-commander';

import { SyncMatchesService } from '../services';

@SubCommand({ name: 'matches' })
export class SyncMatchesSubCommand extends CommandRunner {
  constructor(private readonly syncMatches: SyncMatchesService) {
    super();
  }

  async run(): Promise<void> {
    const leagueListId = [4, 9, 239, 2, 11, 13];
    return this.syncMatches.run(leagueListId);
  }
}

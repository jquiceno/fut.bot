import { Controller, Post } from '@nestjs/common';
import { SyncLiveMatchesService } from '../services';

@Controller('/syncs/matches')
export class SyncMatchesController {
  constructor(private readonly syncLiveMatchesService: SyncLiveMatchesService) {}

  @Post('live')
  async SyncLiveMatches() {
    return this.syncLiveMatchesService.run();
  }
}

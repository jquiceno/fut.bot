import { Controller, Get } from '@nestjs/common';
import { SyncLiveMatchesService } from '../services';

@Controller('/syncs/matches')
export class SyncMatchesController {
  constructor(private readonly syncLiveMatchesService: SyncLiveMatchesService) {}

  @Get('live')
  async SyncLiveMatches() {
    return this.syncLiveMatchesService.run();
  }
}

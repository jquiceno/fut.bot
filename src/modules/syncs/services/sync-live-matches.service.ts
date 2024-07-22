import { Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import * as dayJs from 'dayjs';
import { SyncMatchesService } from './sync-matches.service';

// import { FixtureService } from '@api-football';

@Injectable()
export class SyncLiveMatchesService {
  private readonly fixtures: FirebaseFirestore.CollectionReference;

  constructor(
    private readonly firestore: Firestore,
    private readonly syncMatches: SyncMatchesService,
  ) {
    this.fixtures = firestore.collection('fixtures');
  }

  async run() {
    const response = {
      matches: [],
      leagues: [],
    };

    const date = dayJs();
    const snapshot = await this.fixtures
      .where('fixture.timestamp', '<=', date.toDate())
      .where('fixture.status.long', '!=', 'Match Finished')
      .get();

    if (snapshot.empty) return response;

    const matches = [];

    snapshot.forEach((doc) => matches.push(doc.data()));

    response.matches = matches;

    const leagues = matches.reduce((leagues, match) => {
      const leagueId = match.league.id;
      if (!leagues.includes(leagueId)) {
        leagues.push(leagueId);
      }

      return leagues;
    }, []);

    response.leagues = leagues;

    this.syncMatches.run(leagues).then(() => {
      console.log('Matches synced');
    });

    return response;
  }
}

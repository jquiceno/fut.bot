import { Injectable } from '@nestjs/common';
import { Firestore, Timestamp } from 'firebase-admin/firestore';
import * as dayJs from 'dayjs';

import { FixtureResponse, FixtureService } from '@api-football';

@Injectable()
export class SyncMatchesService {
  constructor(
    private readonly fixtures: FixtureService,
    private readonly firestore: Firestore,
  ) {}
  async run() {
    const leagueListId = ['4', '9', '239', '2', '11', '13'];

    const collection = this.firestore.collection('fixtures');
    const date = dayJs();

    let fixtures: FixtureResponse[] = [];

    for (const leagueId of leagueListId) {
      const { response } = await this.fixtures.getBy({
        from: date.subtract(2, 'days').startOf('day').format('YYYY-MM-DD'),
        to: date.add(7, 'day').format('YYYY-MM-DD'),
        league: leagueId,
        season: date.format('YYYY'),
      });

      fixtures = [...fixtures, ...response];
    }

    for (const fixture of fixtures) {
      const { fixture: match } = fixture;

      const docRef = collection.doc(String(match.id));

      await docRef.set({
        ...fixture,
        fixture: {
          ...match,
          timestamp: Timestamp.fromDate(new Date(match.date)),
        },
      });
    }

    console.log('fixtures', fixtures.length);
  }
}

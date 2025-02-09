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
  async run(leagueListId: number[], fromDate?: Date, toDate?: Date) {
    // const leagueListId = ['4', '9', '239', '2', '11', '13'];

    const collection = this.firestore.collection('fixtures');
    const currentDate = dayJs();

    let fixtures: FixtureResponse[] = [];

    const from = fromDate ? dayJs(fromDate) : currentDate.startOf('day').subtract(1, 'day');
    const to = toDate ? dayJs(toDate) : currentDate.endOf('day').add(7, 'day');

    for (const leagueId of leagueListId) {
      const { response } = await this.fixtures.getBy({
        from: from.format('YYYY-MM-DD'),
        to: to.format('YYYY-MM-DD'),
        league: String(leagueId),
        season: currentDate.format('YYYY'),
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

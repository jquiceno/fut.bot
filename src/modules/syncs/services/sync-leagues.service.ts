import { Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { LeagueService } from '../../api-football';

@Injectable()
export class SyncLeaguesService {
  constructor(
    private readonly league: LeagueService,
    private readonly firestore: Firestore,
  ) {}
  async run() {
    const collection = this.firestore.collection('leagues');

    const { response: leagues } = await this.league.getAll();

    for (const league of leagues) {
      const docRef = collection.doc(String(league.league.id));

      await docRef.set(league);
    }

    console.log('leagues', leagues.length);
  }
}

import { Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { PredictionsService } from '../api-football';

import { getTzDate } from './utils';

@Injectable()
export class ApiService {
  constructor(
    private readonly predictions: PredictionsService,
    private readonly firestore: Firestore,
  ) {}

  async getMatchPrediction(matchIdList: string | string[]) {
    const collection = this.firestore.collection('predictions');

    matchIdList = Array.isArray(matchIdList) ? matchIdList : [matchIdList];

    const predictions = [];

    for (const matchId of matchIdList) {
      const docRef = collection.doc(matchId);
      const match = await docRef.get();

      if (match.exists) {
        predictions.push(match.data().predictions);
        continue;
      }

      const { response } = await this.predictions.getByFixtureId(matchId);

      await docRef.set({
        matchId,
        ...response[0],
        teams: {}, // data.response[0].teams,
      });

      predictions.push(response[0].predictions);
    }

    return predictions;
  }

  async getTodayMatches(leagueListId: string | string[]) {
    try {
      const collection = this.firestore.collection('fixtures');

      const currentDate = getTzDate();

      const startDate = currentDate.startOf('day').toDate();
      const endDate = currentDate.endOf('day').toDate();

      const fixtures: any[] = [];

      const snapshot = await collection
        .where('fixture.timestamp', '>', startDate)
        .where('fixture.timestamp', '<', endDate)
        .where('league.id', '==', Number(leagueListId))
        .get();

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          fixtures.push(doc.data());
        });

        return fixtures;
      }

      return [];
    } catch (error) {
      console.error('Error getting matches');
      console.error(error);
      return [];
    }
  }
}

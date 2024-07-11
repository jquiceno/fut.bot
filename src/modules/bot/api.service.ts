import { Injectable } from '@nestjs/common';
import * as dayJs from 'dayjs';
import { Firestore, Timestamp } from 'firebase-admin/firestore';
import { FixtureService, PredictionsService } from '../api-football';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
const tz: string = 'America/Bogota';

dayJs.extend(utc);
dayJs.extend(timezone);

export interface FixtureInterface {
  fixture: {
    id: string;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first?: number;
      second?: null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed?: string;
    };
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner?: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner?: string;
    };
  };
  goals: {
    home: number;
    away: number;
  };
}

@Injectable()
export class ApiService {
  constructor(
    private readonly predictions: PredictionsService,
    private readonly fixtures: FixtureService,
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
      // const date = dayJs(new Date().setDate(new Date().getDate() - 2)).format('YYYY-MM-DD');

      const date = dayJs().tz(tz);

      const startDate = date.startOf('day');
      const endDate = date.endOf('day');

      // const date = dayJs().format('YYYY-MM-DD');

      let fixtures: any[] = [];

      const snapshot = await collection
        .where('fixture.timestamp', '>', startDate.toDate())
        .where('fixture.timestamp', '<', endDate.toDate())
        .where('league.id', '==', Number(leagueListId))
        .get();

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          fixtures.push(doc.data());
        });

        return fixtures;
      }

      if (!Array.isArray(leagueListId)) leagueListId = [leagueListId];

      for (const leagueId of leagueListId) {
        const { response } = await this.fixtures.getBy({
          from: date.startOf('week').format('YYYY-MM-DD'),
          to: date.endOf('week').format('YYYY-MM-DD'),
          league: leagueId,
          season: '2024',
        });

        fixtures = [...fixtures, ...response];
      }

      for (const fixture of fixtures) {
        const { fixture: match } = fixture;

        const docRef = collection.doc(String(match.id));

        docRef
          .set({
            ...fixture,
            fixture: {
              ...match,
              timestamp: Timestamp.fromDate(new Date(match.date)),
            },
          })
          .catch((error) => {
            console.error('Error saving data:', error);
          });
      }

      return fixtures;
    } catch (error) {
      console.error('Error getting matches');
      console.error(error);
      return [];
    }
  }
}

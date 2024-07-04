import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import * as dayJs from "dayjs";

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

const pre = {};

@Injectable()
export class ApiService {
  constructor(
    @Inject("API_HEADERS")
    private readonly headers: any,
  ) {}

  async getMatchPrediction(matchIdList: string | string[]) {
    matchIdList = Array.isArray(matchIdList) ? matchIdList : [matchIdList];

    const predictions = [];

    for (const matchId of matchIdList) {
      const config = {
        method: "get",
        url: `https://api-football-v1.p.rapidapi.com/v3/predictions?fixture=${matchId}`,
        headers: this.headers,
      };

      if (pre[matchId]) {
        predictions.push(pre[matchId]);
        continue;
      }

      const { data } = await axios.request(config);

      pre[matchId] = data.response[0].predictions;

      predictions.push(data.response[0].predictions);
    }

    return predictions;
  }

  async getTodayMatches(leagueListId: string | string[]) {
    /* const date = dayJs(new Date().setDate(new Date().getDate() - 1)).format(
      "YYYY-MM-DD",
    );*/

    const date = dayJs().format("YYYY-MM-DD");

    let fixtures: FixtureInterface[] = [];

    if (!Array.isArray(leagueListId)) leagueListId = [leagueListId];

    for (const leagueId of leagueListId) {
      const { data } = await axios.get(
        "https://api-football-v1.p.rapidapi.com/v3/fixtures",
        {
          params: {
            date,
            league: leagueId,
            season: "2024",
            timezone: "America/Bogota",
          },
          headers: this.headers,
        },
      );

      fixtures = [...fixtures, ...data.response];
    }

    return fixtures;
  }
}

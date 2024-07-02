import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import * as dayJs from "dayjs";

const predictions = {};

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
    @Inject("API_HEADERS")
    private readonly headers: any,
  ) {}

  async getMatchPrediction(matchId: string) {
    const config = {
      method: "get",
      url: `https://api-football-v1.p.rapidapi.com/v3/predictions?fixture=${matchId}`,
      headers: this.headers,
    };

    if (predictions[matchId]) {
      return predictions[matchId];
    }

    const response = await axios.request(config);
    predictions[matchId] = response.data.response[0];

    return response.data.response[0];
  }

  async getTodayMatches(leagueListId: string | string[]) {
    const date = dayJs().format("YYYY-MM-DD");

    console.log("date", date);

    let fixtures: FixtureInterface[] = [];

    if (!Array.isArray(leagueListId)) leagueListId = [leagueListId];

    /* const config = {
      method: "get",
      url: `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}&league=${leagueId}&season=2024&timezone=America%2FBogota`,
      headers,
    };*/

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

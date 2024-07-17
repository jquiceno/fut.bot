import { Comparison, Fixture, Goals, H2h, FixtureLeague, Prediction, Score, Team } from './default.interface';
import { Country, Season, League } from './league.interface';

export class ApiResponse {
  get: string;
  parameters: object;
  errors: [];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: any[];
}

export class FixtureResponse {
  fixture: Fixture;
  league: FixtureLeague;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
}

export class ApiFixturesResponse extends ApiResponse {
  response: FixtureResponse[];
}

export class PredictionResponse {
  league: FixtureLeague;
  teams: {
    home: Team;
    away: Team;
  };
  predictions: Prediction;
  comparison: Comparison;
  h2h: H2h[];
}

export class ApiPredictionResponse extends ApiResponse {
  response: PredictionResponse[];
}

export class LeagueResponse {
  league: League;
  country: Country;
  seasons: Season[];
}

export class ApiLeagueResponse extends ApiResponse {
  response: LeagueResponse[];
}

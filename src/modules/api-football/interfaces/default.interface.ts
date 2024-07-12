export class FinFixturesQueryInterface {
  date?: string;
  league?: string;
  season?: string;
  timezone?: string;
  from?: string;
  to?: string;
}

export class Fixture {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
}

export class League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: string | null;
  season: number;
  round: string;
}

export class Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

export class ScoreResult {
  home: number;
  away: number;
}

export class Score {
  halftime: ScoreResult;
  fulltime: ScoreResult;
  extratime: ScoreResult;
  penalty: ScoreResult;
}

export class Goals {
  home?: number;
  away?: number;
}

export class Prediction {
  winner: Team;
  win_or_draw: boolean;
  under_over: boolean;
  goals: {
    home?: string;
    away?: string;
  };
  advice: string;
  percent: {
    home: string;
    draw: string;
    away: string;
  };
}

export class ComparisonResult {
  home?: string;
  away?: string;
}

export class Comparison {
  form: ComparisonResult;
  att: ComparisonResult;
  def: ComparisonResult;
  poisson_distribution: ComparisonResult;
  h2h: ComparisonResult;
  goals: ComparisonResult;
  total: ComparisonResult;
}

export class H2h {
  fixture: Fixture;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
}

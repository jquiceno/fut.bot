export interface Country {
  name: string;
  code: null;
  flag: null;
}

export interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
}

export interface Season {
  year: number;
  start: Date;
  end: Date;
  current: boolean;
  coverage: Coverage;
}

export interface Coverage {
  fixtures: {
    events: boolean;
    lineups: boolean;
    statistics_fixtures: boolean;
    statistics_players: boolean;
  };
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}

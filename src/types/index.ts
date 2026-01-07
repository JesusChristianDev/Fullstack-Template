export type Mode = 'random' | 'incredibles';

export type Character = {
  id: string;
  name: string;
  series: string;
  availability: {
    type: string;
    source: string;
    pass?: number;
  };
  is_dlc: boolean;
  heuristics: {
    archetype: string;
    assist_profile: string;
    synergy_tags: string[];
    team_roles: string[];
    difficulty: number;
  };
};

export type TeamSlot = {
  character: Character;
  locked: boolean;
};

export type Team = TeamSlot[];

export type MatchRules = {
  noDuplicatesAcrossTeams: boolean;
  avoidRecentTeams: boolean;
};

export type MatchRecord = {
  id: string;
  played_at: string;
  player_a: string;
  player_b: string;
  winner: string;
  mode: Mode;
  rules: MatchRules;
  team_a: Character[];
  team_b: Character[];
};

export type PlayerStats = {
  league_id: string;
  user_id: string;
  elo: number;
  wins: number;
  losses: number;
  games: number;
  updated_at: string;
};

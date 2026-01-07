import { create } from 'zustand';
import type { Character, MatchRules, Team } from '../types';

export type AppState = {
  selectedPlayerA: string | null;
  selectedPlayerB: string | null;
  mode: 'random' | 'incredibles';
  rules: MatchRules;
  teamA: Team;
  teamB: Team;
  recentTeamsA: string[][];
  recentTeamsB: string[][];
  setPlayers: (playerA: string | null, playerB: string | null) => void;
  setMode: (mode: 'random' | 'incredibles') => void;
  toggleRule: (rule: keyof MatchRules) => void;
  setTeams: (teamA: Character[], teamB: Character[]) => void;
  toggleLock: (team: 'A' | 'B', index: number) => void;
  registerMatch: (teamA: Character[], teamB: Character[]) => void;
  resetTeams: () => void;
};

const emptyTeam = (): Team => [];

export const useAppStore = create<AppState>((set, get) => ({
  selectedPlayerA: null,
  selectedPlayerB: null,
  mode: 'random',
  rules: {
    noDuplicatesAcrossTeams: true,
    avoidRecentTeams: true
  },
  teamA: emptyTeam(),
  teamB: emptyTeam(),
  recentTeamsA: [],
  recentTeamsB: [],
  setPlayers: (playerA, playerB) => set({ selectedPlayerA: playerA, selectedPlayerB: playerB }),
  setMode: (mode) => set({ mode }),
  toggleRule: (rule) => set((state) => ({ rules: { ...state.rules, [rule]: !state.rules[rule] } })),
  setTeams: (teamA, teamB) =>
    set({
      teamA: teamA.map((character) => ({ character, locked: false })),
      teamB: teamB.map((character) => ({ character, locked: false }))
    }),
  toggleLock: (team, index) =>
    set((state) => {
      const key = team === 'A' ? 'teamA' : 'teamB';
      const next = [...state[key]];
      const target = next[index];
      if (!target) return {};
      next[index] = { ...target, locked: !target.locked };
      return { [key]: next } as Partial<AppState>;
    }),
  registerMatch: (teamA, teamB) =>
    set((state) => ({
      recentTeamsA: [teamA.map((member) => member.id), ...state.recentTeamsA].slice(0, 3),
      recentTeamsB: [teamB.map((member) => member.id), ...state.recentTeamsB].slice(0, 3)
    })),
  resetTeams: () => set({ teamA: emptyTeam(), teamB: emptyTeam() })
}));

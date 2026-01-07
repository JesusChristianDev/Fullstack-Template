import type { Character, Mode, Team } from '../types';
import { scoreCharacter, scoreTeam } from './scoring';

export type GenerateOptions = {
  mode: Mode;
  avoidRecentTeams: boolean;
  noDuplicatesAcrossTeams: boolean;
  recentTeamsA: string[][];
  recentTeamsB: string[][];
  lockedTeamA?: Team;
  lockedTeamB?: Team;
};

const TEAM_SIZE = 3;
const SHORTLIST_SIZE = 12;
const BALANCE_WEIGHT = 0.5;

const randomPick = <T,>(items: T[], count: number): T[] => {
  const copy = [...items];
  const result: T[] = [];
  for (let i = 0; i < count; i += 1) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
};

const teamIds = (team: Character[]): string[] => team.map((member) => member.id);

const isTeamRepeated = (team: Character[], recent: string[][]): boolean => {
  const ids = teamIds(team).sort().join('|');
  return recent.some((recentTeam) => recentTeam.slice().sort().join('|') === ids);
};

const fillLockedTeam = (lockedTeam?: Team): Character[] => {
  if (!lockedTeam) return [];
  return lockedTeam.filter((slot) => slot.locked).map((slot) => slot.character);
};

const buildTeamWithLocks = (
  characters: Character[],
  locked: Character[],
  disallowedIds: Set<string>
): Character[] => {
  const available = characters.filter((char) => !disallowedIds.has(char.id) && !locked.some((item) => item.id === char.id));
  const needed = TEAM_SIZE - locked.length;
  return [...locked, ...randomPick(available, needed)];
};

const shortlistCharacters = (characters: Character[]): Character[] => {
  const scored = characters
    .map((character) => ({ character, score: scoreCharacter(character).score }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, SHORTLIST_SIZE).map((item) => item.character);
};

const combinationsOfThree = (characters: Character[]): Character[][] => {
  const results: Character[][] = [];
  for (let i = 0; i < characters.length; i += 1) {
    for (let j = i + 1; j < characters.length; j += 1) {
      for (let k = j + 1; k < characters.length; k += 1) {
        results.push([characters[i], characters[j], characters[k]]);
      }
    }
  }
  return results;
};

const buildTeamFromCombo = (combo: Character[], locked: Character[], shortlist: Character[]): Character[] => {
  const team: Character[] = [];
  const used = new Set<string>();
  locked.forEach((member) => {
    team.push(member);
    used.add(member.id);
  });
  combo.forEach((member) => {
    if (team.length < TEAM_SIZE && !used.has(member.id)) {
      team.push(member);
      used.add(member.id);
    }
  });
  shortlist.forEach((member) => {
    if (team.length < TEAM_SIZE && !used.has(member.id)) {
      team.push(member);
      used.add(member.id);
    }
  });
  return team;
};

const rankTeams = (teams: Character[][], recent: string[][]): { team: Character[]; score: number }[] => {
  return teams
    .map((team) => {
      const recentPenalty = isTeamRepeated(team, recent) ? 1.5 : 0;
      const score = scoreTeam(team, recentPenalty).score;
      return { team, score };
    })
    .sort((a, b) => b.score - a.score);
};

export const generateRandomTeams = (
  characters: Character[],
  options: GenerateOptions
): { teamA: Character[]; teamB: Character[] } => {
  const lockedA = fillLockedTeam(options.lockedTeamA);
  const lockedB = fillLockedTeam(options.lockedTeamB);
  const disallowedA = new Set(lockedA.map((char) => char.id));
  const disallowedB = new Set(lockedB.map((char) => char.id));

  const teamA = buildTeamWithLocks(characters, lockedA, disallowedA);
  const disallowedForB = new Set<string>([...disallowedB, ...(options.noDuplicatesAcrossTeams ? teamA.map((c) => c.id) : [])]);
  const teamB = buildTeamWithLocks(characters, lockedB, disallowedForB);

  if (options.avoidRecentTeams && (isTeamRepeated(teamA, options.recentTeamsA) || isTeamRepeated(teamB, options.recentTeamsB))) {
    return generateRandomTeams(characters, options);
  }

  return { teamA, teamB };
};

export const generateIncredibleTeams = (
  characters: Character[],
  options: GenerateOptions
): { teamA: Character[]; teamB: Character[] } => {
  const lockedA = fillLockedTeam(options.lockedTeamA);
  const lockedB = fillLockedTeam(options.lockedTeamB);
  const shortlist = shortlistCharacters(characters);
  const combos = combinationsOfThree(shortlist);

  const rankedA = rankTeams(
    combos.map((combo) => buildTeamFromCombo(combo, lockedA, shortlist)),
    options.recentTeamsA
  );

  const rankedB = rankTeams(
    combos.map((combo) => buildTeamFromCombo(combo, lockedB, shortlist)),
    options.recentTeamsB
  );

  const topA = rankedA.slice(0, 30);
  const topB = rankedB.slice(0, 30);

  let best = { teamA: topA[0].team, teamB: topB[0].team, objective: -Infinity };

  topA.forEach((candidateA) => {
    topB.forEach((candidateB) => {
      const hasDupes = options.noDuplicatesAcrossTeams
        ? candidateA.team.some((member) => candidateB.team.find((bMember) => bMember.id === member.id))
        : false;
      if (hasDupes) return;

      const objective = Math.min(candidateA.score, candidateB.score) - BALANCE_WEIGHT * Math.abs(candidateA.score - candidateB.score);
      if (objective > best.objective) {
        best = { teamA: candidateA.team, teamB: candidateB.team, objective };
      }
    });
  });

  return { teamA: best.teamA, teamB: best.teamB };
};

export const smartSwap = (
  team: Character[],
  slotIndex: number,
  characters: Character[],
  options: { recentTeams: string[][]; noDuplicates: boolean; otherTeam: Character[] }
): Character[] => {
  const current = [...team];
  const currentIds = new Set(current.map((member) => member.id));
  const disallowed = new Set<string>([...currentIds, ...(options.noDuplicates ? options.otherTeam.map((member) => member.id) : [])]);

  const candidates = characters.filter((char) => !disallowed.has(char.id));
  let bestTeam = current;
  let bestScore = scoreTeam(current, 0).score;

  candidates.forEach((candidate) => {
    const next = [...current];
    next[slotIndex] = candidate;
    const recentPenalty = isTeamRepeated(next, options.recentTeams) ? 1.5 : 0;
    const score = scoreTeam(next, recentPenalty).score;
    if (score > bestScore) {
      bestScore = score;
      bestTeam = next;
    }
  });

  return bestTeam;
};

import { scoreTeam } from '../src/engine/scoring';
import type { Character } from '../src/types';

const makeCharacter = (id: string, tags: string[]): Character => ({
  id,
  name: id,
  series: 'Test',
  availability: { type: 'base', source: 'test' },
  is_dlc: false,
  heuristics: {
    archetype: 'balanced',
    assist_profile: 'rush',
    synergy_tags: tags,
    team_roles: ['point'],
    difficulty: 2
  }
});

describe('scoreTeam', () => {
  it('rewards core tags and diversity', () => {
    const team = [
      makeCharacter('a', ['entry', 'damage']),
      makeCharacter('b', ['lockdown', 'beam']),
      makeCharacter('c', ['pressure', 'mobility'])
    ];
    const result = scoreTeam(team, 0);
    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown.core).toBeGreaterThan(0);
  });
});

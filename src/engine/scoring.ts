import type { Character } from '../types';
import { mapSynergyTags, type TagWeight } from './tagMapping';

export type TeamScore = {
  score: number;
  breakdown: Record<string, number>;
  tags: TagWeight[];
};

const CORE_TAGS = ['entry', 'lockdown', 'damage'];

export const scoreCharacter = (character: Character): TeamScore => {
  const tags = mapSynergyTags(character.heuristics.synergy_tags);
  const totals = tags.reduce<Record<string, number>>((acc, item) => {
    acc[item.tag] = (acc[item.tag] || 0) + item.weight;
    return acc;
  }, {});

  const coreScore = CORE_TAGS.reduce((sum, tag) => sum + (totals[tag] || 0) * 2, 0);
  const beamBonus = (totals.beam || 0) * 0.8;
  const pressureBonus = (totals.pressure || 0) * 0.8;
  const mobilityBonus = (totals.mobility || 0) * 0.6;

  return {
    score: coreScore + beamBonus + pressureBonus + mobilityBonus,
    breakdown: {
      core: coreScore,
      beam: beamBonus,
      pressure: pressureBonus,
      mobility: mobilityBonus
    },
    tags
  };
};

export const scoreTeam = (characters: Character[], recentPenalty: number): TeamScore => {
  const tagWeights = characters.flatMap((char) => mapSynergyTags(char.heuristics.synergy_tags));
  const tagTotals = tagWeights.reduce<Record<string, number>>((acc, item) => {
    acc[item.tag] = (acc[item.tag] || 0) + item.weight;
    return acc;
  }, {});

  const coreScore = CORE_TAGS.reduce((sum, tag) => sum + (tagTotals[tag] || 0) * 3, 0);
  const beamBonus = (tagTotals.beam || 0) * 1.2;
  const pressureBonus = (tagTotals.pressure || 0) * 1.2;
  const diversityBonus = new Set(characters.map((char) => char.heuristics.archetype)).size * 0.6;
  const roleDiversityBonus = new Set(characters.flatMap((char) => char.heuristics.team_roles)).size * 0.4;

  return {
    score: coreScore + beamBonus + pressureBonus + diversityBonus + roleDiversityBonus - recentPenalty,
    breakdown: {
      core: coreScore,
      beam: beamBonus,
      pressure: pressureBonus,
      diversity: diversityBonus,
      roleDiversity: roleDiversityBonus,
      recentPenalty
    },
    tags: tagWeights
  };
};

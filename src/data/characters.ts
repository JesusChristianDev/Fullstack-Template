import roster from '../../assets/data/characters.json';
import type { Character } from '../types';

export const characters = roster.characters as Character[];
export const rosterMeta = {
  schemaVersion: roster.schema_version,
  game: roster.game,
  generatedAt: roster.generated_at,
  notes: roster.notes
};

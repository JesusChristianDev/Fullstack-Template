export type CanonTag = 'entry' | 'lockdown' | 'beam' | 'damage' | 'pressure' | 'mobility';

export type TagWeight = {
  tag: CanonTag;
  weight: number;
  source: 'canon' | 'mapped';
};

const canonTags: CanonTag[] = ['entry', 'lockdown', 'beam', 'damage', 'pressure', 'mobility'];

const mappedTags: Record<string, TagWeight[]> = {
  projectile: [{ tag: 'beam', weight: 0.5, source: 'mapped' }],
  control: [{ tag: 'lockdown', weight: 0.5, source: 'mapped' }],
  setup: [{ tag: 'lockdown', weight: 0.5, source: 'mapped' }],
  trap: [
    { tag: 'lockdown', weight: 0.5, source: 'mapped' },
    { tag: 'pressure', weight: 0.5, source: 'mapped' }
  ],
  counter: [{ tag: 'lockdown', weight: 0.5, source: 'mapped' }],
  tank: [{ tag: 'pressure', weight: 0.5, source: 'mapped' }],
  utility: []
};

export const mapSynergyTags = (tags: string[]): TagWeight[] => {
  const result: TagWeight[] = [];
  tags.forEach((tag) => {
    if (canonTags.includes(tag as CanonTag)) {
      result.push({ tag: tag as CanonTag, weight: 1, source: 'canon' });
    } else if (mappedTags[tag]) {
      result.push(...mappedTags[tag]);
    }
  });
  return result;
};

export const summarizeRoles = (tags: TagWeight[]): string => {
  const totals = tags.reduce<Record<CanonTag, number>>(
    (acc, item) => {
      acc[item.tag] = (acc[item.tag] || 0) + item.weight;
      return acc;
    },
    {
      entry: 0,
      lockdown: 0,
      beam: 0,
      damage: 0,
      pressure: 0,
      mobility: 0
    }
  );

  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0);

  return sorted
    .slice(0, 3)
    .map(([tag]) => tag[0].toUpperCase() + tag.slice(1))
    .join(' + ');
};

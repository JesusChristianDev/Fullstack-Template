import { calculateElo } from '../src/utils/elo';

describe('calculateElo', () => {
  it('updates ratings with expected score', () => {
    const result = calculateElo(1000, 1000, 1, 0);
    expect(result.newRatingA).toBeGreaterThan(1000);
    expect(result.newRatingB).toBeLessThan(1000);
  });

  it('keeps ratings when draw score symmetry', () => {
    const result = calculateElo(1200, 1000, 0, 1);
    expect(result.newRatingA).toBeLessThan(1200);
    expect(result.newRatingB).toBeGreaterThan(1000);
  });
});

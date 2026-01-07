export const K_FACTOR = 24;

export const expectedScore = (ratingA: number, ratingB: number): number => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

export const calculateElo = (
  ratingA: number,
  ratingB: number,
  scoreA: 0 | 1,
  scoreB: 0 | 1
): { newRatingA: number; newRatingB: number } => {
  const expectedA = expectedScore(ratingA, ratingB);
  const expectedB = expectedScore(ratingB, ratingA);
  const newRatingA = Math.round(ratingA + K_FACTOR * (scoreA - expectedA));
  const newRatingB = Math.round(ratingB + K_FACTOR * (scoreB - expectedB));
  return { newRatingA, newRatingB };
};

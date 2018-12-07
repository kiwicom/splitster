import * as R from 'ramda';

import seedRandom from 'seedrandom';

const getSeedNumber = key => seedRandom(key)();

const getWinningVariant = (variants, defaultVariant, seedNumber) => {
  const ratioSum = R.sum(
    R.map(([variantId, variant]) => variant.ratio, variants),
  );

  // Seed number (from interval [0, 1]) is interpolated to interval [0-ratio sum]
  let floater = seedNumber * ratioSum;

  const winningVariant = R.find(([variantId, variant]) => {
    floater -= variant.ratio;
    return floater <= 0;
  }, variants);
  return winningVariant[0] || defaultVariant;
};

const setWinningVariant = userId => ([testId, test]) => {
  if (test.disabled) {
    return [testId, R.assoc('winningVariant', test.defaultVariant, test)];
  }

  const seedNumber = getSeedNumber(`${testId}_${test.version}:${userId}`);
  console.log('seedNumber', `${testId}_${test.version}:${userId}`, seedNumber);

  const winningVariant = getWinningVariant(
    R.toPairs(test.variants),
    test.defaultVariant,
    seedNumber,
  );
  console.log('winningVariant', winningVariant);
  return [testId, R.assoc('winningVariant', winningVariant, test)];
};

export default setWinningVariant;

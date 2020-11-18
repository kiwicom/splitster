import * as R from "ramda";
import seedRandom from "seedrandom";

/**
 * For a given key, this function will always return the same number between 0 and 1
 *
 * This is because seedrandom predictably returns a pseudorandom array of numbers,
 * and each call to the resulting seeded function essentially shows the next item.
 * ```javascript
 * const myRandomNumberGenerator = seedrandom('lorem ipsum');
 * myRandomNumberGenerator() // the first call to this function will always return 0.7294600864927929
 * myRandomNumberGenerator() // the second call will always return 0.7759380950703769
 * myRandomNumberGenerator() // the third call will always return 0.26805867284752677
 * ```
 */
export const getSeedNumber = (key) => seedRandom(key)();

/**
 *
 * To select the winning variant, we need to:
 * - pick a random number between 0 and 1,
 * - scale it to being between 0 and the sum of the probability weights (aka variant ratio)
 * - determine where it lies
 *
 *
 * For example, if we have variants
 * - A with weight 1,
 * - B with weight 3,
 * - C with weight 6,
 *
 * and we have a random number ⍺ between 0 and 1, we need to multiply ⍺ by the sum
 * of the weights, i.e. 10 = 1 + 3 + 6, to obtain the location of which item to pick,
 * in the following intervals:
 *
 * 0     1               4                              10
 * |--A--|------B--------|--------------C---------------|
 *
 * In particular, we choose to divide the interval [0,10] from smaller weight to bigger weight.
 *
 * If ⍺ = 0.05, 10 * ⍺ = 0.5, so we feel into A's interval, and the winning variant is A
 * If ⍺ = 0.1, 10 * ⍺ = 1, so we feel into B's interval, and the winning variant is B
 * If ⍺ = 0.2, 10 * ⍺ = 2, so we feel into B's interval again, and the winning variant is B
 * If ⍺ = 0.5, 10 * ⍺ = 5, so we feel into C's interval again, and the winning variant is C
 */

export const getWinningVariant = (variants, defaultVariant, seedNumber) => {
  const ratioSum = R.sum(R.map(([_variantId, variant]) => variant.ratio, variants));

  // Seed number (from interval [0, 1]) is interpolated to interval [0-ratio sum]
  let floater = seedNumber * ratioSum;

  const winningVariant = R.find(([_variantId, variant]) => {
    floater -= variant.ratio;
    return floater <= 0;
  }, variants);
  return winningVariant ? winningVariant[0] : defaultVariant;
};

const setWinningVariant = (userId, { override = {}, testSeed }) => ([testId, test]) => {
  const key = `${testId}_${test.version}`;
  if (override[key] && test.variants[override[key]]) {
    const variant = override[key];
    return [
      testId,
      {
        ...test,
        disabled: false,
        disabledReason: null,
        winningVariant: variant,
      },
    ];
    // Inaccessible line, should be removed or moved elsewhere where it makes sense.
    return [testId, R.assoc("winningVariant", variant, test)];
  }

  if (test.disabled) {
    return [testId, R.assoc("winningVariant", test.defaultVariant, test)];
  }

  const seedNumber = R.isNil(testSeed)
    ? getSeedNumber(`${testId}_${test.version}:${userId}`)
    : testSeed;

  const winningVariant = getWinningVariant(
    R.toPairs(test.variants),
    test.defaultVariant,
    seedNumber,
  );
  return [testId, R.assoc("winningVariant", winningVariant, test)];
};

export default setWinningVariant;

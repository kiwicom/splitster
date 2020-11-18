import * as R from "ramda";
import jsCookies from "js-cookie";

import { getTestsFromConfig } from "../records/abTest";
import { mergeDefaultConfig } from "../records/config";

/**
 * Splitster client class abstraction
 * containing all the common methods
 */
// eslint-disable-next-line fp/no-class
export class SplitsterClient {
  constructor({ config, user, userId, override = {} }, copy) {
    if (!config && !user && !userId && copy) {
      // Create new one from copy
      // eslint-disable-next-line fp/no-mutation
      this.tests = copy.tests;
      // eslint-disable-next-line fp/no-mutation
      this.user = copy.user;
      return;
    }

    // Initialize splitster

    // Set user
    // eslint-disable-next-line fp/no-mutation
    this.user = user;
    // eslint-disable-next-line fp/no-mutation
    this.userId = userId;
    // eslint-disable-next-line fp/no-mutation
    this.tests = getTestsFromConfig(config.tests, { override, user, userId });
  }

  getSaveResults = (includeVersions? = false, noDisabled? = false) =>
    R.compose(
      R.fromPairs,
      R.map(([testId, test]) => {
        // eslint-disable-next-line no-nested-ternary
        const winning = test.disabled
          ? noDisabled
            ? test.defaultVariant
            : `__disabled_${test.disabledReason}`
          : test.winningVariant;
        return [includeVersions ? `${testId}_${test.version}` : testId, winning];
      }),
      R.toPairs,
    )(this.tests);

  get = (testId) => {
    if (!R.has(testId, this.tests)) {
      // eslint-disable-next-line no-console
      console.warn(
        `Splitster: Trying to access not existing test: ${testId}, your value will be null.`,
      );
      return { value: null };
    }
    return { value: this.tests[testId].winningVariant };
  };

  set = (testId, variantId, cookie = false) => {
    try {
      if (cookie) {
        // Dev only for replacing also cookie.
        // You need to handle parsing by yourself in `override` object
        const cookieKey = `splitster_${testId}_${this.tests[testId].version}`;
        jsCookies.set(cookieKey, variantId);
      }
    } catch (err) {}

    return new SplitsterClient(
      {},
      {
        options: this.options,
        user: this.user,
        tests: R.assocPath([testId, "winningVariant"], variantId, this.tests),
      },
    );
  };
}

const init = (config, user, userId, override) => {
  const validConfig = mergeDefaultConfig(config);
  // TODO: in createValidConfig each test must me merged with test default config
  // also options should be merged
  return new SplitsterClient({ config: validConfig, user, userId, override });
};

export default init;

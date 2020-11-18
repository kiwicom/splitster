import * as R from "ramda";
import { Random } from "random-js";

import testOverridePersistance from "./testOverridePersistance";

const disableByUsage = (override, testRandom) => ([testId, test]) => {
  if (test.disabled || testOverridePersistance(testId, override) || R.isNil(test.usage)) {
    return [testId, test];
  }

  const rand = testRandom || new Random().integer(0, 99);
  if (rand >= test.usage) {
    return [
      testId,
      R.merge(test, {
        disabled: true,
        disabledReason: "usage",
      }),
    ];
  }
  return [testId, test];
};

export default disableByUsage;

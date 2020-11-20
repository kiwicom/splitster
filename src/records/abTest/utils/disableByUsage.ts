import * as R from "ramda";
import { Random } from "random-js";

import testOverridePersistance from "./testOverridePersistance";
import type { OverrideObject, PairedTestIdConfig } from "./types";

const disableByUsage = (
  override: OverrideObject,
  testRandom: number = new Random().integer(0, 99),
) => ([testId, test]: PairedTestIdConfig): PairedTestIdConfig => {
  if (
    (test.disabled != null && test.disabled) ||
    testOverridePersistance(testId, override) ||
    R.isNil(test.usage)
  ) {
    return [testId, test];
  }

  if (testRandom >= test.usage) {
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

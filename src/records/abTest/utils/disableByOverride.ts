import * as R from "ramda";

import checkDisabled from "./checkDisabled";
import type { OverrideObject, PairedTestIdConfig } from "./types";

const disableByOverride = (override: OverrideObject) => ([
  testId,
  test,
]: PairedTestIdConfig): PairedTestIdConfig => {
  if (test.disabled != null && test.disabled) {
    return [testId, test];
  }
  return [
    testId,
    R.merge(test, checkDisabled(override[`${testId}_${test.version}`] || override[testId])),
  ];
};

export default disableByOverride;

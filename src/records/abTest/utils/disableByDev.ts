import * as R from "ramda";

import type { PairedTestIdConfig } from "./types";

type Override = Record<string, string>;

const disableByDev = (override: Override) => ([
  testId,
  test,
]: PairedTestIdConfig): PairedTestIdConfig => {
  if (override[testId] && override[testId] === "__disabled_dev") {
    return [
      testId,
      R.merge(test, {
        disabled: true,
        disabledReason: "dev",
      }),
    ];
  }
  return [testId, test];
};

export default disableByDev;

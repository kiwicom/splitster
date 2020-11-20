import * as R from "ramda";

import type { PairedTestIdConfig } from "./types";

const disableByConfig = ([testId, test]: PairedTestIdConfig): PairedTestIdConfig => {
  if (test.disabled != null && test.disabled && test.disabledReason == null) {
    return [
      testId,
      R.merge(test, {
        disabled: true,
        disabledReason: "config",
      }),
    ];
  }
  return [testId, test];
};

export default disableByConfig;

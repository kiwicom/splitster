import * as R from "ramda";

import disableByOverride from "../disableByOverride";
import { REASONS } from "../checkDisabled";

const override = R.fromPairs(
  REASONS.map((reason, index) => [`TEST_${index}`, `__disabled_${reason}`]),
);

const DISABLED_TEST_CONFIG = { disabled: true };
const EMPTY_TEST_CONFIG = {};

describe("disableByOverride", () => {
  test("should leave test be if already disabled", () => {
    expect(
      disableByOverride(override)([
        "TEST_0",
        // @ts-expect-error passing just enough to make the test pass
        DISABLED_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_0", { disabled: true }]);
  });
  REASONS.forEach((reason, index) => {
    test(`should correctly check disabled from override: ${reason}`, () => {
      expect(
        disableByOverride(override)([
          `TEST_${index}`,
          // @ts-expect-error passing just enough to make the test pass
          EMPTY_TEST_CONFIG,
        ]),
      ).toStrictEqual([`TEST_${index}`, { disabled: true, disabledReason: reason }]);
    });
  });
});

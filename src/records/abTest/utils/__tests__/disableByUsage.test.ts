import disableByUsage from "../disableByUsage";

const override = {
  TEST_1: "__disabled_dev",
};
const DISABLED_TEST_CONFIG = { disabled: true };
const EMPTY_TEST_CONFIG = {};
const USAGE_TEST_CONFIG = {
  70: { usage: 70 },
  50: { usage: 50 },
  40: { usage: 40 },
};

describe("disableByUsage", () => {
  test("should not touch if already disabled", () => {
    expect(
      disableByUsage(override)([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        DISABLED_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_1", { disabled: true }]);
  });
  test("should not touch if override correctly set", () => {
    expect(
      disableByUsage(override)([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_1", {}]);
  });
  test("should not touch if usage not specified", () => {
    expect(
      disableByUsage(override)([
        "TEST_XY",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_XY", {}]);
  });
  test("should disable by usage if random if bigger than test usage", () => {
    expect(
      disableByUsage(
        {},
        50,
      )([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        USAGE_TEST_CONFIG[70],
      ]),
    ).toStrictEqual(["TEST_1", { usage: 70 }]);
    expect(
      disableByUsage(
        {},
        50,
      )([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        USAGE_TEST_CONFIG[40],
      ]),
    ).toStrictEqual(["TEST_1", { usage: 40, disabled: true, disabledReason: "usage" }]);
    expect(
      disableByUsage(
        {},
        50,
      )([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        USAGE_TEST_CONFIG[50],
      ]),
    ).toStrictEqual(["TEST_1", { usage: 50, disabled: true, disabledReason: "usage" }]);
  });
});

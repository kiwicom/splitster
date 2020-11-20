import disableByDev from "../disableByDev";

const override = {
  TEST_1: "__disabled_dev",
  TEST_2: "abc",
};

const disabledDevTest = {
  disabled: true,
  disabledReason: "dev",
};

const EMPTY_TEST_CONFIG = {};

describe("disableByDev", () => {
  test("should disable by dev if specified in override", () => {
    expect(
      disableByDev(override)([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_1", disabledDevTest]);
  });
  test("should not change test if not disabled by dev", () => {
    expect(
      disableByDev(override)([
        "TEST_2",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_2", {}]);
  });
  test("should not change test if not specified in override", () => {
    expect(
      disableByDev(override)([
        "TEST_3",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_TEST_CONFIG,
      ]),
    ).toStrictEqual(["TEST_3", {}]);
  });
});

import disableByConfig from "../disableByConfig";

const disabledTest = {
  id: "X",
  disabled: true,
};

const enabledTest = {
  id: "X",
  disabled: false,
};

const disabledTestReason = {
  id: "X",
  disabled: true,
  disabledReason: "usage",
};

describe("disableByConfig", () => {
  test("should return disabled config if disabled and not yet specified reason", () => {
    // @ts-expect-error passing only necessary properties
    expect(disableByConfig(["X", disabledTest])).toStrictEqual([
      "X",
      { ...disabledTest, disabledReason: "config" },
    ]);
  });
  test("should let test be if not disabled", () => {
    // @ts-expect-error passing only necessary properties
    expect(disableByConfig(["X", enabledTest])).toStrictEqual(["X", enabledTest]);
  });
  test("should let test be if disabled and reason specified", () => {
    // @ts-expect-error passing only necessary properties
    expect(disableByConfig(["X", disabledTestReason])).toStrictEqual(["X", disabledTestReason]);
  });
});

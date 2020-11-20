import testOverridePersistance from "../testOverridePersistance";

const override = {
  TEST_1: "setProperly",
  TEST_2: "__disabled_config",
  TEST_3: "__disabled_null",
};

describe("#testOverridePersistance", () => {
  test("should check properly set", () => {
    expect(testOverridePersistance("TEST_1", override)).toBe(true);
  });
  test("should check unset", () => {
    expect(testOverridePersistance("TEST_XY", override)).toBe(false);
  });
  test("should check disabled config", () => {
    expect(testOverridePersistance("TEST_2", override)).toBe(false);
  });
  test("should check disabled null", () => {
    expect(testOverridePersistance("TEST_3", override)).toBe(false);
  });
});

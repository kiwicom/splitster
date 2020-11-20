import disableByUserGroups from "../disableByUserGroups";

const TEST_1 = {
  userGroup: {
    lang: ["en", "de"],
    browser: "chrome",
  },
};
const TEST_2 = {
  userGroupExclude: {
    lang: ["en", "de"],
    browser: "chrome",
  },
};

const enabled = { disabled: false, disabledReason: null };
const disabledUserGroup = { disabled: true, disabledReason: "user_group" };
const disabledUserGroupExclude = {
  disabled: true,
  disabledReason: "user_group_exclude",
};

describe("disableByUserGroups", () => {
  test("should return identity function if user not specified", () => {
    // @ts-expect-error This is just to verify the function is the identity function
    expect(disableByUserGroups(null)(1)).toStrictEqual(1);
  });
  test("should not change if already disabled", () => {
    const DISABLED_TEST_CONFIG = { disabled: true };
    expect(
      disableByUserGroups({})([
        "X",
        // @ts-expect-error passing just enough to make the test pass
        DISABLED_TEST_CONFIG,
      ]),
    ).toStrictEqual(["X", { disabled: true }]);
  });
  test("should not change if set in override", () => {
    const EMPTY_TEST_CONFIG = {};
    expect(
      disableByUserGroups(
        {},
        { X: "abc" },
      )([
        "X",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_TEST_CONFIG,
      ]),
    ).toStrictEqual(["X", {}]);
  });
  test("should not change if test user group is empty", () => {
    const EMPTY_USER_GROUP_TEST_CONFIG = { userGroup: {} };
    expect(
      disableByUserGroups(
        {},
        {},
      )([
        "X",
        // @ts-expect-error passing just enough to make the test pass
        EMPTY_USER_GROUP_TEST_CONFIG,
      ]),
    ).toStrictEqual(["X", { userGroup: {} }]);
  });

  test("should corerctly disable by user group", () => {
    expect(
      disableByUserGroups(
        { lang: "en", browser: "chrome" },
        {},
      )([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        TEST_1,
      ]),
    ).toStrictEqual(["TEST_1", { ...TEST_1, ...enabled }]);
    expect(
      disableByUserGroups(
        { lang: "cz", browser: "chrome" },
        {},
      )([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        TEST_1,
      ]),
    ).toStrictEqual(["TEST_1", { ...TEST_1, ...disabledUserGroup }]);
    expect(
      disableByUserGroups(
        { lang: "en", browser: "safari" },
        {},
      )([
        "TEST_1",
        // @ts-expect-error passing just enough to make the test pass
        TEST_1,
      ]),
    ).toStrictEqual(["TEST_1", { ...TEST_1, ...disabledUserGroup }]);
  });

  // ========
  // exclude
  test("should disable by user group exclude for all", () => {
    expect(
      disableByUserGroups(
        { lang: "en", browser: "chrome" },
        {},
        true,
      )([
        "TEST_2",
        // @ts-expect-error passing just enough to make the test pass
        TEST_2,
      ]),
    ).toStrictEqual(["TEST_2", { ...TEST_2, ...disabledUserGroupExclude }]);
  });
  test("should disable by user group exclude for at least one user group", () => {
    expect(
      disableByUserGroups(
        { lang: "cz", browser: "chrome" },
        {},
        true,
      )([
        "TEST_2",
        // @ts-expect-error passing just enough to make the test pass
        TEST_2,
      ]),
    ).toStrictEqual(["TEST_2", { ...TEST_2, ...disabledUserGroupExclude }]);
    expect(
      disableByUserGroups(
        { lang: "en", browser: "safari" },
        {},
        true,
      )([
        "TEST_2",
        // @ts-expect-error passing just enough to make the test pass
        TEST_2,
      ]),
    ).toStrictEqual(["TEST_2", { ...TEST_2, ...disabledUserGroupExclude }]);
  });
  test("should pass user group excklude", () => {
    expect(
      disableByUserGroups(
        { lang: "cz", browser: "safari" },
        {},
        true,
      )([
        "TEST_2",
        // @ts-expect-error passing just enough to make the test pass
        TEST_2,
      ]),
    ).toStrictEqual(["TEST_2", { ...TEST_2, ...enabled }]);
  });
});

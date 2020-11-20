import * as R from "ramda";

import testOverridePersistance from "./testOverridePersistance";
import passTestUserGroups from "./passTestUserGroups";
import type { OverrideObject, PairedTestIdConfig } from "./types";
import type { TestConfiguration, User } from "../../..";

const getDisabledReason = (exclude: boolean) => (exclude ? "user_group_exclude" : "user_group");

const disableByUserGroups = (
  user: User | null,
  override: OverrideObject = {},
  exclude = false,
): ((pairedConfig: PairedTestIdConfig) => PairedTestIdConfig) => {
  if (R.isNil(user) || R.isEmpty(user)) {
    return R.identity;
  }

  const checker: (val: boolean) => boolean = exclude ? R.identity : R.not;

  return ([testId, test]: PairedTestIdConfig) => {
    const userGroup = exclude ? test.userGroupExclude : test.userGroup;

    if (
      (test.disabled != null && test.disabled) ||
      testOverridePersistance(testId, override) ||
      R.isNil(userGroup) ||
      R.isEmpty(userGroup)
    ) {
      return [testId, test];
    }

    const disabledByUserGroups = checker(passTestUserGroups(userGroup, user, exclude));

    return [
      testId,
      R.compose<TestConfiguration, TestConfiguration, TestConfiguration>(
        R.assoc("disabledReason", disabledByUserGroups ? getDisabledReason(exclude) : null),
        R.assoc("disabled", disabledByUserGroups),
      )(test),
    ];
  };
};

export default disableByUserGroups;

import * as R from "ramda";

import type { User, UserGroup } from "../../..";

export const getUserGroupRule = (
  userGroupSubConfig: UserGroup,
  exclude = false,
): ((user: User) => boolean) => {
  if (typeof userGroupSubConfig === "function") {
    return userGroupSubConfig;
  }
  // { key: "string", key: ["string", "string"]}
  const rules = R.map(
    (key) => (user: User) => {
      const rule = userGroupSubConfig[key];
      if (typeof rule === "function") {
        return rule(user);
      }

      const allowedValues = Array.isArray(rule) ? rule : [rule];

      return R.contains(R.prop(key, user), allowedValues);
    },
    R.keys(userGroupSubConfig),
  );
  // TODO: test anypass
  return exclude ? R.anyPass(rules) : R.allPass(rules);
};

// export const getUserGroup = userGroupConfig => {
//   if (typeof userGroupConfig === 'function') {
//     return [userGroupConfig];
//   }

//   const userGroupSubConfigs = Array.isArray(userGroupConfig)
//     ? userGroupConfig
//     : [userGroupConfig];

//   return R.map(getUserGroupRule, userGroupSubConfigs);
// };

// export const checkUserToUserGroup = (user, userGroup) =>
//   R.allPass(userGroup)(user);

const passTestUserGroups = (userGroup: UserGroup, user: User, exclude = false): boolean => {
  if (R.isEmpty(userGroup)) {
    return true;
  }

  if (Array.isArray(userGroup)) {
    return R.map((_userGroup) => passTestUserGroups(_userGroup, user), userGroup).reduce(
      (prev, current) => (exclude ? prev || current : prev && current),
      !exclude,
    );
  }

  return getUserGroupRule(userGroup, exclude)(user);

  //   if (typeof testUserGroup === 'string') {
  //     return checkUserToUserGroup(user, userGroups[testUserGroup]);
  //   }

  // return checkUserToUserGroup(user, getUserGroup(userGroup));
};

export default passTestUserGroups;

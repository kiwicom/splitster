import * as R from "ramda";

import disableByDev from "./utils/disableByDev";
import disableByOverride from "./utils/disableByOverride";
import disableByConfig from "./utils/disableByConfig";
import disableByUserGroups from "./utils/disableByUserGroups";
import disableByUsage from "./utils/disableByUsage";
import setWinningVariant from "./utils/setWinningVariant";
import type { OverrideObject, PairedTestIdConfig } from "./utils/types";
import type { Tests, User } from "../..";

// Ramda is missing overloads for compose for more than 6 functions in compose,
// so we add it here.
declare module "ramda" {
  function compose<V0, T1, T2, T3, T4, T5, T6, T7>(
    fn6: (x: T6) => T7,
    fn5: (x: T5) => T6,
    fn4: (x: T4) => T5,
    fn3: (x: T3) => T4,
    fn2: (x: T2) => T3,
    fn1: (x: T1) => T2,
    fn0: (x0: V0) => T1,
  ): (x0: V0) => T7;
}

type Options = {
  override: OverrideObject;
  user: User;
  userId: string;
};

// 1. disable by dev (developer specified it in override)
// 2. disable by config (test configuration contains `disabled: true`)
// 3. disable by previous disable (override is `__disabled_reason`)
// 4. disable by user group (user is not in some of the user group)
// 5. disable by user group exclude (user is in some if the exclusion user group)
// 6. disable by usage if override does not already have value (random)
// 7. set value if not disabled (if not disabled, based on user id set value)
export const getTestFromConfig = ({
  override,
  user,
  userId,
}: Options): ((pairedTestConfig: PairedTestIdConfig) => PairedTestIdConfig) =>
  R.compose<
    PairedTestIdConfig,
    PairedTestIdConfig,
    PairedTestIdConfig,
    PairedTestIdConfig,
    PairedTestIdConfig,
    PairedTestIdConfig,
    PairedTestIdConfig,
    PairedTestIdConfig
  >(
    setWinningVariant(userId, { override }),
    disableByUsage(override),
    disableByUserGroups(user, override, true), // user group exclude
    disableByUserGroups(user, override),
    // disableByDeadline,
    disableByConfig,
    disableByOverride(override),
    disableByDev(override),
  );

export const getTestsFromConfig = (tests: Tests, opts: Options): Tests =>
  R.compose<Tests, PairedTestIdConfig[], PairedTestIdConfig[], Tests>(
    R.fromPairs,
    R.map(getTestFromConfig(opts)),
    R.toPairs,
  )(tests);

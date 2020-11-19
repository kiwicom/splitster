// @ts-expect-error This is a JS file that hasn't been converted yet
export { default as init } from "./clients";

export { parseCookies } from "./utils/cookies";

export type DisabledReason =
  | "usage"
  | "separate_test"
  | "user_group"
  | "user_group_exclude"
  | "config"
  | "deadline"
  | "dev";

// Tests
export type StandardVariantConfiguration = {
  value: string;
  ratio: number;
};
export type ShortVariantConfiguration = number;
export type VariantConfiguration = StandardVariantConfiguration | ShortVariantConfiguration;
export type VariantId = string;
export type Variants = Record<VariantId, VariantConfiguration>;
export type StandardVariants = Record<VariantId, StandardVariantConfiguration>;

export type User = Record<string, unknown>;

export type TestId = string;
export type TestConfiguration<U extends User = User, V extends Variants = Variants> = {
  /**
   * Short description - optional
   */
  description?: string;
  /**
   * Groups which user must satisfy - optional
   */
  userGroup?: UserGroup<U>;
  /**
   * Groups which user must satisfy - optional
   */
  userGroupExclude?: UserGroup<U>;
  /**
   *  Overall usage of test in % - optional
   * Iif not specified 100 is used
   */
  usage?: number;

  /**
   *  If the test is disabled, it always returns the default variant
   */
  disabled?: boolean;
  /**
   *  If the test is disabled, it always returns the default variant
   */
  disabledReason?: DisabledReason | null;

  /**
   *  Default variant id
   */
  defaultVariant: string | null;

  /**
   * Variants of the test specified by id.
   */
  variants: V;

  /**
   * Version of the test - optional
   * Defaults to 0
   */
  version?: number;
};

export type Tests<U extends User = User, V extends Variants = Variants> = Record<
  TestId,
  TestConfiguration<U, V>
>;

// UserGroups
export type UserGroupName = string;
export type UserGroupRule<U extends User = User> =
  | Record<keyof U, unknown>
  | ((user: U) => boolean);
export type UserGroup<U extends User = User> = UserGroupRule<U> | UserGroupRule<U>[];

export type SplitsterInitConfig<U extends User = User, V extends Variants = Variants> = {
  tests: Tests<U, V>;
};

// SplitsterClient

export type SplitsterResults = Record<string, string>;

export type DisabledReason =
  | "usage"
  | "separate_test"
  | "user_group"
  | "user_group_exclude"
  | "config"
  | "deadline"
  | "dev";

// Tests
export type VariantConfiguration = {
  value: string;
  ratio: number;
} | number;
export type VariantId = string;

export type TestId = string;
export type TestConfiguration<User extends Object, Variants extends Record<VariantId, VariantConfiguration>> = {
  /**
   * Short description - optional
   */
  description?: string;
  /**
   * Groups which user must satisfy - optional
   */
  userGroup?: UserGroup<User>;
  /**
   * Groups which user must satisfy - optional
   */
  userGroupExclude?: UserGroup<User>;
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
  disabledReason?: DisabledReason;

  /**
   *  Default variant id
   */
  defaultVariant: keyof Variants;

  /** 
   * Variants of the test specified by id.
   */
  variants: Variants | {};

  /**
   * Version of the test - optional
   * Defaults to 0
   */
  version?: number;
};


export type Tests<User extends Object, Variants extends Record<VariantId, VariantConfiguration>> = Record<
  TestId,
  TestConfiguration<User, Variants>
>;

// UserGroups
export type UserGroupName = string;
export type UserGroupRule<User extends Object> =
  | Record<keyof User, unknown>
  | ((user: User) => boolean);
export type UserGroup<User> = UserGroupRule<User> | UserGroupRule<User>[];

// Options
export type Options = {
  cookies: {
    /**
     * If true, tests will not be saved to cookies.
     * Initialization won't get result from cookies but always run.
     */
    disabled: boolean;
    /**
     * Number of days cookies should last.
     * @TODO deprecate this field in favor of `expirationInDays`
     */
    expiration: number;
    /**
     * Prefix of cookies set in browser - default splitster {name_test_id}
     * @TODO deprecate this field in favor of `namePrefix`
     */
    name?: string;
  };
};

export type SplitsterInitConfig<User extends Object, Variants extends Record<VariantId, VariantConfiguration>> = {
  tests: Tests<User, Variants>;
  options: Options;
};

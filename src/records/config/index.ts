import * as R from "ramda";

import type {
  SplitsterInitConfig,
  StandardVariantConfiguration,
  StandardVariants,
  TestConfiguration,
  Tests,
  VariantConfiguration,
  Variants,
} from "../..";

export const defaultConfig = {
  tests: {},
};

export const defaultTestConfig = {
  description: "",
  userGroup: {},
  userGroupExclude: {} as const,
  usage: 100,
  defaultVariant: null,
  variants: {} as const,
  disabled: false,
  disabledReason: null,
  version: 0,
};

// TypeScript guards
// https://rangle.io/blog/how-to-use-typescript-type-guards
const isStandardVariant = (
  variantToCheck: VariantConfiguration,
): variantToCheck is StandardVariantConfiguration =>
  R.has("value", variantToCheck) && R.has("ratio", variantToCheck);

export const mapVariants: <V extends Variants = Variants>(
  variants: V,
) => StandardVariants = R.mapObjIndexed((variant, key) => {
  if (isStandardVariant(variant)) {
    return variant;
  }
  return {
    value: key,
    ratio: variant,
  };
});

export const mergeTestConfig = R.compose<TestConfiguration, TestConfiguration, TestConfiguration>(
  (test) => R.assoc("variants", mapVariants(test.variants), test),
  R.mergeDeepRight(defaultTestConfig),
);

export const mergeDefaultConfig = (config: SplitsterInitConfig) =>
  R.compose<SplitsterInitConfig, SplitsterInitConfig, SplitsterInitConfig>(
    R.assoc("tests", R.map<Tests, Tests>(mergeTestConfig, config.tests)),
    R.mergeDeepRight(defaultConfig),
  )(config);

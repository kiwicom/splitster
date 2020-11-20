// It seems Prettier does not like tuples despite setting the parser to 'typescript' or 'babel-ts'
// https://github.com/prettier/prettier/issues/9208#issuecomment-693099275

import type { StandardVariantConfiguration, TestConfiguration, TestConfigurationInput } from "../../..";

// eslint-disable-next-line prettier/prettier
export type PairedTestIdConfigInput =  [testId: string, test: TestConfigurationInput];
export type PairedTestIdConfig =  [testId: string, test: TestConfiguration];
export type PairedStandardVariantIdConfig =  [variantId: string, variant: StandardVariantConfiguration];

type TestId = string;
type DisabledReason = string;
export type OverrideObject = Record<TestId, DisabledReason>;

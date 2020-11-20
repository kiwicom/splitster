import * as R from "ramda";

import type { OverrideObject } from "./types";

// If test is set to disabled config (or wrong 'null'), it will consider as rewritable in cookies
const testOverridePersistance = (testId: string, override: OverrideObject) =>
  R.has(testId, override) &&
  override[testId] !== "__disabled_config" &&
  override[testId] !== "__disabled_null";

export default testOverridePersistance;

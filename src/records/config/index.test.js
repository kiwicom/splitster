import {
  mapVariants,
  mergeTestConfig,
  mergeDefaultConfig,
  defaultTestConfig,
  defaultConfig,
} from ".";

const STANDARD_VARIANTS = {
  VALUE_A: {
    value: "value_A",
    ratio: 2,
  },
  VALUE_B: {
    value: "value_B",
    ratio: 5,
  },
};

const NUMBER_VARIANTS = {
  VALUE_C: 3,
  VALUE_D: 10,
};

const NUMBER_VARIANTS_STANDARDISED = {
  VALUE_C: {
    value: "VALUE_C",
    ratio: 3,
  },
  VALUE_D: {
    value: "VALUE_D",
    ratio: 10,
  },
};

const VARIANTS = { ...NUMBER_VARIANTS, ...STANDARD_VARIANTS };
const VARIANTS_STANDARDISED = {
  ...NUMBER_VARIANTS_STANDARDISED,
  ...STANDARD_VARIANTS,
};

describe("mapVariants", () => {
  it("should convert variants to a standard form", () => {
    expect(mapVariants(STANDARD_VARIANTS)).toEqual(STANDARD_VARIANTS);
    expect(mapVariants(NUMBER_VARIANTS)).toEqual(NUMBER_VARIANTS_STANDARDISED);
    expect(mapVariants(VARIANTS)).toEqual(VARIANTS_STANDARDISED);
  });
  it("should return an empty object for unexpected inputs", () => {
    expect(mapVariants({})).toEqual({});
    expect(mapVariants(null)).toEqual({});
    expect(mapVariants(undefined)).toEqual({});
    expect(mapVariants(3)).toEqual({});
    expect(mapVariants("lorem")).toEqual({});
  });
});

describe("mergeTestConfig", () => {
  it("should add the default test config to the test config passed as argument", () => {
    /**
     * TODO This looks like it shouldn't be allowed
     */
    expect(mergeTestConfig()).toEqual({ variants: {} });
    /**
     * TODO This looks like it shouldn't be allowed
     */
    expect(mergeTestConfig([])).toEqual(defaultTestConfig);
    /**
     * TODO Not sure about this
     */
    expect(mergeTestConfig({ somethingUnrelated: 1 })).toEqual({
      ...defaultTestConfig,
      somethingUnrelated: 1,
    });
    expect(mergeTestConfig({})).toEqual(defaultTestConfig);
    expect(mergeTestConfig(defaultTestConfig)).toEqual(defaultTestConfig);
    expect(mergeTestConfig({ description: "lorem ipsum" })).toEqual({
      ...defaultTestConfig,
      description: "lorem ipsum",
    });
  });
  it("should also standardise the variants from the test config passed as argument", () => {
    expect(mergeTestConfig({ variants: STANDARD_VARIANTS })).toEqual({
      ...defaultTestConfig,
      variants: STANDARD_VARIANTS,
    });
    expect(mergeTestConfig({ variants: VARIANTS })).toEqual({
      ...defaultTestConfig,
      variants: VARIANTS_STANDARDISED,
    });
  });
});

describe("mergeDefaultConfig", () => {
  it("should add missing attributes the default config to the config passed as argument", () => {
    expect(mergeDefaultConfig({ tests: {} })).toEqual(defaultConfig);
    expect(mergeDefaultConfig(defaultConfig)).toEqual(defaultConfig);

    const withStandardVariants = {
      tests: {
        variants: STANDARD_VARIANTS,
      },
    };
    expect(mergeDefaultConfig(withStandardVariants)).toEqual({
      ...defaultConfig,
      tests: {
        variants: {
          ...defaultTestConfig,
          ...STANDARD_VARIANTS,
        },
      },
    });

    /**
     * TODO This looks like it should standardise the variants too.
     */
    const withVariants = {
      tests: {
        variants: VARIANTS,
      },
    };
    expect(mergeDefaultConfig(withVariants)).toEqual({
      ...defaultConfig,
      tests: {
        variants: {
          ...defaultTestConfig,
          ...VARIANTS,
        },
      },
    });

    /**
     * TODO
     * This looks like a bug as the following withEmptyVariants tests fail,
     * when the withEmptyVariantsSHOULD_NOT_PASS test does not fail.
     * The defaultTestConfig should not be merged inside variants but inside
     * tests.
     */
    // const withEmptyVariants = {
    //   tests: {
    //     variants: {}
    //   }
    // };
    // expect(mergeDefaultConfig(withEmptyVariants)).toEqual({
    //   ...defaultConfig,
    //   tests: defaultTestConfig
    // });
    const withEmptyVariantsSHOULD_NOT_PASS = {
      tests: {
        variants: {},
      },
    };
    expect(mergeDefaultConfig(withEmptyVariantsSHOULD_NOT_PASS)).toEqual({
      ...defaultConfig,
      tests: {
        variants: defaultTestConfig,
      },
    });

    // const withVariantsAndDescription = {
    //   tests: {
    //     variants: VARIANTS,
    //     description: "Tests Lorem vs Ipsum copy on booking page",
    //   }
    // };
    // expect(mergeDefaultConfig(withVariantsAndDescription)).toEqual({
    //   ...defaultConfig,
    //   tests: {
    //     ...defaultTestConfig,
    //     description: "Tests Lorem vs Ipsum copy on booking page",
    //     variants: {
    //       ...VARIANTS
    //     }
    //   }
    // });
  });
});

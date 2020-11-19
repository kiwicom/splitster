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
  test("should convert variants to a standard form", () => {
    expect(mapVariants(STANDARD_VARIANTS)).toStrictEqual(STANDARD_VARIANTS);
    expect(mapVariants(NUMBER_VARIANTS)).toStrictEqual(NUMBER_VARIANTS_STANDARDISED);
    expect(mapVariants(VARIANTS)).toStrictEqual(VARIANTS_STANDARDISED);
  });
  test("should return an empty object for unexpected inputs", () => {
    expect(mapVariants({})).toStrictEqual({});
    // @ts-expect-error improper argument
    expect(mapVariants(null)).toStrictEqual({});
    // @ts-expect-error improper argument
    expect(mapVariants(undefined)).toStrictEqual({});
    // @ts-expect-error improper argument
    expect(mapVariants(3)).toStrictEqual({});
    // @ts-expect-error improper argument
    expect(mapVariants("lorem")).toStrictEqual({});
  });
});

describe("mergeTestConfig", () => {
  test("should add the default test config to the test config passed as argument", () => {
    /**
     * TODO This looks like it shouldn't be allowed
     */
    // @ts-expect-error improper argument
    expect(mergeTestConfig()).toStrictEqual({ variants: {} });
    /**
     * TODO This looks like it shouldn't be allowed
     */
    // @ts-expect-error improper argument
    expect(mergeTestConfig([])).toStrictEqual(defaultTestConfig);
    /**
     * TODO Not sure about this
     */
    // @ts-expect-error improper argument
    expect(mergeTestConfig({ somethingUnrelated: 1 })).toStrictEqual({
      ...defaultTestConfig,
      somethingUnrelated: 1,
    });
    // @ts-expect-error improper argument
    expect(mergeTestConfig({})).toStrictEqual(defaultTestConfig);
    expect(mergeTestConfig(defaultTestConfig)).toStrictEqual(defaultTestConfig);
    // @ts-expect-error improper argument
    expect(mergeTestConfig({ description: "lorem ipsum" })).toStrictEqual({
      ...defaultTestConfig,
      description: "lorem ipsum",
    });
  });
  test("should also standardise the variants from the test config passed as argument", () => {
    expect(
      mergeTestConfig({ variants: STANDARD_VARIANTS, defaultVariant: "value_A" }),
    ).toStrictEqual({
      ...defaultTestConfig,
      variants: STANDARD_VARIANTS,
      defaultVariant: "value_A",
    });
    expect(mergeTestConfig({ variants: VARIANTS, defaultVariant: "value_A" })).toStrictEqual({
      ...defaultTestConfig,
      variants: VARIANTS_STANDARDISED,
      defaultVariant: "value_A",
    });
  });
});

describe("mergeDefaultConfig", () => {
  test("should add missing attributes the default config to the config passed as argument", () => {
    expect(mergeDefaultConfig({ tests: {} })).toStrictEqual(defaultConfig);
    expect(mergeDefaultConfig(defaultConfig)).toStrictEqual(defaultConfig);

    const withStandardVariants = {
      tests: {
        banner: {
          variants: STANDARD_VARIANTS,
          defaultVariant: "value_A",
        },
      },
    };
    expect(mergeDefaultConfig(withStandardVariants)).toStrictEqual({
      ...defaultConfig,
      tests: {
        banner: {
          ...defaultTestConfig,
          variants: STANDARD_VARIANTS,
          defaultVariant: "value_A",
        },
      },
    });

    const withVariants = {
      tests: {
        banner: {
          variants: VARIANTS,
          defaultVariant: "value_A",
        },
      },
    };
    expect(mergeDefaultConfig(withVariants)).toStrictEqual({
      ...defaultConfig,
      tests: {
        banner: {
          ...defaultTestConfig,
          variants: VARIANTS_STANDARDISED,
          defaultVariant: "value_A",
        },
      },
    });

    const withEmptyVariants = {
      tests: {
        banner: {
          variants: {},
          defaultVariant: "",
        },
      },
    };
    expect(mergeDefaultConfig(withEmptyVariants)).toStrictEqual({
      ...defaultConfig,
      tests: {
        banner: {
          ...defaultTestConfig,
          variants: {},
          defaultVariant: "",
        },
      },
    });

    const withVariantsAndDescription = {
      tests: {
        banner: {
          variants: VARIANTS,
          defaultVariant: "value_A",
          description: "Tests Lorem vs Ipsum copy on booking page",
        },
      },
    };
    expect(mergeDefaultConfig(withVariantsAndDescription)).toStrictEqual({
      ...defaultConfig,
      tests: {
        banner: {
          ...defaultTestConfig,
          defaultVariant: "value_A",
          description: "Tests Lorem vs Ipsum copy on booking page",
          variants: {
            ...VARIANTS_STANDARDISED,
          },
        },
      },
    });
  });
});

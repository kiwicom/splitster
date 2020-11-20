import * as R from "ramda";

import setWinningVariant, { getSeedNumber, getWinningVariant } from "../setWinningVariant";

describe("setWinningVariant", () => {
  describe("getSeedNumber", () => {
    test("is stable for a given key", () => {
      /**
       * NOTE
       * There's no need to mock seedrandom library because it generates pseudo random
       * numbers predictably: 1 seed creates a random sequence of numbers which will always
       * stay in that order.
       */

      expect(getSeedNumber("text")).toStrictEqual(0.6249876746073828);
      expect(getSeedNumber("shared_prefix:some-user-id")).toStrictEqual(0.9460367025947125);
      expect(getSeedNumber("shared_prefix:some-different-user-id")).toStrictEqual(
        0.8879574238959159,
      );
      expect(getSeedNumber("shared_prefix:wefnoi1-r9egrenwo9")).toStrictEqual(0.6119172247266617);
    });
  });

  describe("getWinningVariant", () => {
    const variants = R.toPairs({
      x: { ratio: 1, value: "x" },
      y: { ratio: 3, value: "y" },
      z: { ratio: 6, value: "z" },
    });
    test("should get correct winning variant", () => {
      expect(getWinningVariant(variants, "x", 0)).toStrictEqual("x");
      expect(getWinningVariant(variants, "x", 0.1)).toStrictEqual("x");
      expect(getWinningVariant(variants, "x", 0.2)).toStrictEqual("y");
      expect(getWinningVariant(variants, "x", 0.3)).toStrictEqual("y");
      expect(getWinningVariant(variants, "x", 0.5)).toStrictEqual("z");
    });
    test("should return default variant if number exceeds", () => {
      expect(getWinningVariant(variants, "x", 1.1)).toStrictEqual("x");
    });
  });
  describe("setWinningVariant", () => {
    test("should set default if test is disabled", () => {
      expect(
        setWinningVariant("", { testSeed: 0 })([
          "x",
          { variants: {}, defaultVariant: "x", disabled: true },
        ]),
      ).toStrictEqual([
        "x",
        { variants: {}, defaultVariant: "x", winningVariant: "x", disabled: true },
      ]);
    });
    const testConfig = {
      variants: {
        x: { ratio: 1, value: "x" },
        y: { ratio: 3, value: "y" },
        z: { ratio: 6, value: "z" },
      },
      defaultVariant: "x",
    };
    test("should set correct winning variant", () => {
      expect(setWinningVariant("", { testSeed: 0 })(["x", testConfig])).toStrictEqual([
        "x",
        { ...testConfig, winningVariant: "x" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.1 })(["x", testConfig])).toStrictEqual([
        "x",
        { ...testConfig, winningVariant: "x" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.2 })(["x", testConfig])).toStrictEqual([
        "x",
        { ...testConfig, winningVariant: "y" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.3 })(["x", testConfig])).toStrictEqual([
        "x",
        { ...testConfig, winningVariant: "y" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.5 })(["x", testConfig])).toStrictEqual([
        "x",
        { ...testConfig, winningVariant: "z" },
      ]);
    });
    test("should set default winning variant", () => {
      expect(setWinningVariant("", { testSeed: 1.1 })(["x", testConfig])).toStrictEqual([
        "x",
        { ...testConfig, winningVariant: "x" },
      ]);
    });
    test("should set override as winning variant", () => {
      expect(
        setWinningVariant("", {
          override: { testId_undefined: "y" },
          testSeed: 1.1,
        })(["testId", testConfig]),
      ).toStrictEqual([
        "testId",
        {
          ...testConfig,
          disabled: false,
          disabledReason: null,
          winningVariant: "y",
        },
      ]);
      expect(
        setWinningVariant("", {
          override: { testId_200: "y" },
          testSeed: 1.1,
        })(["testId", { ...testConfig, version: 200 }]),
      ).toStrictEqual([
        "testId",
        {
          ...testConfig,
          version: 200,
          disabled: false,
          disabledReason: null,
          winningVariant: "y",
        },
      ]);
    });
  });
});

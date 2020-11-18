import * as R from "ramda";

import setWinningVariant, { getSeedNumber, getWinningVariant } from "../setWinningVariant";

describe("setWinningVariant", () => {
  describe("getSeedNumber", () => {
    it("is stable for a given key", () => {
      /**
       * NOTE
       * There's no need to mock seedrandom library because it generates pseudo random
       * numbers predictably: 1 seed creates a random sequence of numbers which will always
       * stay in that order.
       */

      expect(getSeedNumber("text")).toEqual(0.6249876746073828);
      expect(getSeedNumber("shared_prefix:some-user-id")).toEqual(0.9460367025947125);
      expect(getSeedNumber("shared_prefix:some-different-user-id")).toEqual(0.8879574238959159);
      expect(getSeedNumber("shared_prefix:wefnoi1-r9egrenwo9")).toEqual(0.6119172247266617);
    });
  });

  describe("getWinningVariant", () => {
    const variants = R.toPairs({
      x: { ratio: 1 },
      y: { ratio: 3 },
      z: { ratio: 6 },
    });
    it("should get correct winning variant", () => {
      expect(getWinningVariant(variants, "x", 0)).toEqual("x");
      expect(getWinningVariant(variants, "x", 0.1)).toEqual("x");
      expect(getWinningVariant(variants, "x", 0.2)).toEqual("y");
      expect(getWinningVariant(variants, "x", 0.3)).toEqual("y");
      expect(getWinningVariant(variants, "x", 0.5)).toEqual("z");
    });
    it("should return default variant if number exceeds", () => {
      expect(getWinningVariant(variants, "x", 1.1)).toEqual("x");
    });
  });
  describe("setWinningVariant", () => {
    it("should set default if test is disabled", () => {
      expect(setWinningVariant("", {})(["x", { defaultVariant: "x", disabled: true }])).toEqual([
        "x",
        { defaultVariant: "x", winningVariant: "x", disabled: true },
      ]);
    });
    const test = {
      variants: {
        x: { ratio: 1 },
        y: { ratio: 3 },
        z: { ratio: 6 },
      },
      defaultVariant: "x",
    };
    it("should set correct winning variant", () => {
      expect(setWinningVariant("", { testSeed: 0 })(["x", test])).toEqual([
        "x",
        { ...test, winningVariant: "x" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.1 })(["x", test])).toEqual([
        "x",
        { ...test, winningVariant: "x" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.2 })(["x", test])).toEqual([
        "x",
        { ...test, winningVariant: "y" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.3 })(["x", test])).toEqual([
        "x",
        { ...test, winningVariant: "y" },
      ]);
      expect(setWinningVariant("", { testSeed: 0.5 })(["x", test])).toEqual([
        "x",
        { ...test, winningVariant: "z" },
      ]);
    });
    it("should set default winning variant", () => {
      expect(setWinningVariant("", { testSeed: 1.1 })(["x", test])).toEqual([
        "x",
        { ...test, winningVariant: "x" },
      ]);
    });
    it("should set override as winning variant", () => {
      expect(
        setWinningVariant("", {
          override: { testId_undefined: "y" },
          testSeed: 1.1,
        })(["testId", test]),
      ).toEqual([
        "testId",
        {
          ...test,
          disabled: false,
          disabledReason: null,
          winningVariant: "y",
        },
      ]);
      expect(
        setWinningVariant("", {
          override: { testId_200: "y" },
          testSeed: 1.1,
        })(["testId", { ...test, version: 200 }]),
      ).toEqual([
        "testId",
        {
          ...test,
          version: 200,
          disabled: false,
          disabledReason: null,
          winningVariant: "y",
        },
      ]);
    });
  });
});

import jsCookie from "js-cookie";
import * as R from "ramda";

import {
  BASIC_CONFIG,
  BASIC_CONFIG_WITH_DISABLED_WITH_REASON,
  BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT_WITH_VERSION,
  BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT,
  BASIC_CONFIG_WITH_VERSION,
} from "./__fixtures__/basic-config";
import { EMPTY_CONFIG } from "./__fixtures__/empty-config";
import { EMPTY_TESTS_CONFIG } from "./__fixtures__/empty-tests-config";

import initClient, { SplitsterClient } from ".";

const mockSeedRandom = jest.fn();
// This is to ensure we can predictably set the winning variants
jest.mock("seedrandom", () => {
  return jest.fn().mockImplementation((key) => mockSeedRandom(key));
});

afterEach(() => {
  mockSeedRandom.mockRestore();
});

describe("initClient", () => {
  it("should initialise a new SplitsterClient", () => {
    mockSeedRandom.mockImplementation(EMPTY_TESTS_CONFIG.mockSeedRandomImplementation);
    const client = initClient(EMPTY_TESTS_CONFIG.config);
    expect(client).toBeInstanceOf(SplitsterClient);
  });

  it("should set default values", () => {
    mockSeedRandom.mockImplementation(EMPTY_TESTS_CONFIG.mockSeedRandomImplementation);
    const client = initClient(EMPTY_TESTS_CONFIG.config);
    expect(client.tests).toEqual(EMPTY_TESTS_CONFIG.config.tests);
    expect(client.tests).toEqual(EMPTY_TESTS_CONFIG.config.tests);
  });

  test("user groups are taken into account (with default value as fallback)", () => {
    const tests = {
      banner: {
        defaultVariant: "hidden",
        variants: {
          hidden: 1,
          visible: 0,
        },
        description: "New banner showing promotional information",
      },
      coolFeature: {
        defaultVariant: "off",
        variants: {
          on: 1,
          off: 1,
        },
        description: "Cool new feature that will blow your mind!",
        userGroup: {
          lang: ["en", "fr"],
        },
      },
    };
    const englishUser = {
      lang: "en",
    };
    const frenchUser = {
      lang: "fr",
    };
    const czechUser = {
      lang: "cz",
    };
    mockSeedRandom.mockImplementation((key) => {
      if (key === "banner_0:some-unique-identifier-for-this-english-user") return () => 0.3;
      if (key === "coolFeature_0:some-unique-identifier-for-this-english-user") return () => 0.3;
      if (key === "banner_0:some-unique-identifier-for-this-french-user") return () => 0.3;
      if (key === "coolFeature_0:some-unique-identifier-for-this-french-user") return () => 0.7;
      if (key === "banner_0:some-unique-identifier-for-this-czech-user") return () => 0.3;
      if (key === "coolFeature_0:some-unique-identifier-for-this-czech-user") return () => 0.3;
      return () => null;
    });
    const EnglishSplitsterClient = initClient(
      { tests },
      englishUser,
      "some-unique-identifier-for-this-english-user",
    );
    const FrenchSplitsterClient = initClient(
      { tests },
      frenchUser,
      "some-unique-identifier-for-this-french-user",
    );
    const CzechSplitsterClient = initClient(
      { tests },
      czechUser,
      "some-unique-identifier-for-this-czech-user",
    );

    expect(EnglishSplitsterClient.get("banner").value).toEqual("hidden");
    expect(EnglishSplitsterClient.get("coolFeature").value).toEqual("on");

    expect(FrenchSplitsterClient.get("banner").value).toEqual("hidden");
    expect(FrenchSplitsterClient.get("coolFeature").value).toEqual("off");

    expect(CzechSplitsterClient.get("banner").value).toEqual("hidden");
    // Test is not applicable so it defaults to default value
    expect(CzechSplitsterClient.get("coolFeature").value).toEqual("off");
  });
});

describe("SplitsterClient", () => {
  describe("constructor", () => {
    it("initialises values", () => {
      const CONFIGS = [EMPTY_CONFIG, EMPTY_TESTS_CONFIG, BASIC_CONFIG];
      const USER_CONFIGS = [{}, { lang: "en" }];
      const USER_IDs = [null, "", "some-random-id"];
      CONFIGS.forEach(({ config, mockSeedRandomImplementation }) => {
        USER_CONFIGS.forEach((userConfig) => {
          USER_IDs.forEach((userId) => {
            mockSeedRandom.mockImplementation(mockSeedRandomImplementation);
            const client = new SplitsterClient({
              config,
              user: userConfig,
              userId,
            });
            expect(client.user).toEqual(userConfig);
            expect(client.userId).toEqual(userId);
            expect(client.options).toEqual(config.options);
            if (config.tests == null || R.isEmpty(config.tests)) {
              expect(client.tests).toEqual({});
            } else {
              const expectedTests = (test) => ({
                ...test,
                disabled: false,
                disabledReason: null,
                winningVariant: undefined,
              });
              const expectedResult = {};
              Object.keys(client.tests).forEach((testId) => {
                expectedResult[testId] = expectedTests(client.tests[testId]);
              });

              expect(client.tests).toEqual(expectedResult);
            }
          });
        });
      });
    });
  });

  describe("get", () => {
    it(`should return an object with key "value" and value null
        if the testId passed in arguments is not found within the
        configured tests`, () => {
      const spy = jest.spyOn(global.console, "warn").mockImplementation();

      mockSeedRandom.mockImplementation(EMPTY_TESTS_CONFIG.mockSeedRandomImplementation);
      const clientWithNoTests = initClient(EMPTY_TESTS_CONFIG.config);
      expect(clientWithNoTests.get()).toEqual({ value: null });
      expect(spy).toHaveBeenCalledWith(
        "Splitster: Trying to access not existing test: undefined, your value will be null.",
      );

      expect(clientWithNoTests.get("some-test-id")).toEqual({ value: null });
      expect(spy).toHaveBeenCalledWith(
        "Splitster: Trying to access not existing test: some-test-id, your value will be null.",
      );

      mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);
      const clientWithSomeTests = initClient(BASIC_CONFIG.config);
      expect(clientWithSomeTests.get("banner")).not.toEqual({ value: null });
      expect(clientWithSomeTests.get("some-unknown-test-id")).toEqual({
        value: null,
      });
      expect(spy).toHaveBeenCalledWith(
        "Splitster: Trying to access not existing test: some-unknown-test-id, your value will be null.",
      );
      spy.mockRestore();
    });

    it(`should return an object with key "value" and value the winning variant`, () => {
      mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);
      const clientWithSomeTests = initClient(BASIC_CONFIG.config);
      expect(clientWithSomeTests.get("banner")).toEqual({
        value: "winningVariant",
      });
      expect(clientWithSomeTests.get("loginButton")).toEqual({
        value: "winningVariant",
      });
      expect(clientWithSomeTests.get("homepage")).toEqual({
        value: "winningVariant",
      });
    });
  });

  describe("set", () => {
    it("returns a new instance of the client", () => {
      const client = initClient(EMPTY_TESTS_CONFIG.config);
      const modifiedClient = client.set("someTestId", "someVariantId");
      expect(client).toEqual(client);
      expect(client).not.toEqual(modifiedClient);
      expect(modifiedClient).toBeInstanceOf(SplitsterClient);
    });
    it("returns a new instance of the client, even with edge case values", () => {
      const client = initClient(EMPTY_TESTS_CONFIG.config);
      const edgeCases = [null, undefined, "", {}];
      edgeCases.forEach((edgeCase) => {
        edgeCases.forEach((edgeCase2) => {
          expect(client.set(edgeCase, edgeCase2).get(edgeCase)).toEqual({
            value: edgeCase2,
          });
        });
      });
    });
    it("returns a new instance of the client with updated winning variant for the given testId", () => {
      mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);

      const client = initClient(BASIC_CONFIG.config);
      expect(client.get("banner")).toEqual({
        value: "winningVariant",
      });
      expect(client.get("loginButton")).toEqual({
        value: "winningVariant",
      });
      const modifiedClient = client.set("banner", "A");
      // This test's winning variant is updated
      expect(modifiedClient.get("banner")).toEqual({ value: "A" });
      // Other test's winning variant is preserved
      expect(modifiedClient.get("loginButton")).toEqual({
        value: "winningVariant",
      });
    });
    it("returns a new instance of the client with updated winning variant for the given testId, even if testId is not present in original client configuration object", () => {
      const spy = jest.spyOn(global.console, "warn").mockImplementation();
      mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);
      const client = initClient(BASIC_CONFIG.config);
      expect(client.get("banner")).toEqual({
        value: "winningVariant",
      });
      expect(client.get("unknownTestId")).toEqual({
        value: null,
      });
      expect(spy).toHaveBeenCalledWith(
        "Splitster: Trying to access not existing test: unknownTestId, your value will be null.",
      );
      const modifiedClient = client.set("unknownTestId", "A");
      // This test's winning variant is updated
      expect(modifiedClient.get("unknownTestId")).toEqual({ value: "A" });
      // Other test's winning variant is preserved
      expect(modifiedClient.get("banner")).toEqual({
        value: "winningVariant",
      });

      spy.mockRestore();
    });
    it("returns a new instance of the client with updated winning variant for the given testId, even if variantId is not present in the initial configuration object", () => {
      mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);
      const client = initClient(BASIC_CONFIG.config);
      expect(client.get("banner")).toEqual({
        value: "winningVariant",
      });
      const modifiedClient = client.set("banner", "amazing");
      // This test's winning variant is updated
      expect(modifiedClient.get("banner")).toEqual({ value: "amazing" });
    });
    it("returns a new instance of the client with updated winning variant for the given testId, even if neither the testId nor variantId are present in the initial configuration object", () => {
      const client = initClient(EMPTY_TESTS_CONFIG.config);
      const modifiedClient = client.set("banner", "A");
      expect(modifiedClient.get("banner")).toEqual({ value: "A" });
    });
    it("sets the related cookie if instructed to do so", () => {
      jest.mock("js-cookie", () => ({
        get: () => "lorem",
        set: jest.fn(),
      }));
      const spy = jest.spyOn(jsCookie, "set");
      mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);

      // TODO It does not work if the tests are {}
      const client = initClient(BASIC_CONFIG.config);
      client.set("banner", "A");
      expect(spy).not.toHaveBeenCalled();
      const modifiedClient2 = client.set("banner", "B", true);
      expect(spy).toHaveBeenCalledWith(`splitster_banner_0`, "B");
      modifiedClient2.set("banner", "A", true);
      expect(spy).toHaveBeenCalledWith(`splitster_banner_0`, "A");

      spy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe("getSaveResults", () => {
    it("should should return an empty object when no tests are provided", () => {
      mockSeedRandom.mockImplementation(EMPTY_TESTS_CONFIG.mockSeedRandomImplementation);
      const client = initClient(EMPTY_TESTS_CONFIG.config);
      expect(client.getSaveResults()).toEqual({});
    });
    describe("should should return the winning variant id for each test", () => {
      test("default", () => {
        mockSeedRandom.mockImplementation(BASIC_CONFIG.mockSeedRandomImplementation);
        const client = initClient(BASIC_CONFIG.config);
        expect(client.getSaveResults()).toEqual({
          banner: "winningVariant",
          loginButton: "winningVariant",
          homepage: "winningVariant",
        });
      });

      test("or disabled reason (if provided) for each test", () => {
        mockSeedRandom.mockImplementation(
          BASIC_CONFIG_WITH_DISABLED_WITH_REASON.mockSeedRandomImplementation,
        );
        const client = initClient(BASIC_CONFIG_WITH_DISABLED_WITH_REASON.config);
        expect(client.getSaveResults()).toEqual({
          banner: "winningVariant",
          loginButton: "winningVariant",
          homepage: "__disabled_because it is not ready yet",
        });
      });
      test("or fallback disabled reason (if not provided) for each test", () => {
        mockSeedRandom.mockImplementation(
          BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT.mockSeedRandomImplementation,
        );
        const client = initClient(BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT.config);
        expect(client.getSaveResults()).toEqual({
          banner: "winningVariant",
          loginButton: "winningVariant",
          homepage: "__disabled_config",
        });
      });
      test("with the version in the testId if requested", () => {
        mockSeedRandom.mockImplementation(BASIC_CONFIG_WITH_VERSION.mockSeedRandomImplementation);
        const client = initClient(BASIC_CONFIG_WITH_VERSION.config);
        expect(client.getSaveResults(true)).toEqual({
          banner_0: "winningVariant",
          loginButton_5: "superdupercool",
          homepage_0: "winningVariant",
        });
      });
      test("with the default variant if the test is disabled, and noDisabled option is set to true", () => {
        mockSeedRandom.mockImplementation(
          BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT.mockSeedRandomImplementation,
        );
        const client = initClient(BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT.config);
        expect(client.getSaveResults(false, true)).toEqual({
          banner: "winningVariant",
          loginButton: "winningVariant",
          homepage: "default",
        });
      });
      test("with the version in the testId and disabled tests", () => {
        mockSeedRandom.mockImplementation(
          BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT_WITH_VERSION.mockSeedRandomImplementation,
        );
        const client = initClient(
          BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT_WITH_VERSION.config,
        );
        expect(client.getSaveResults(true, true)).toEqual({
          loginButton_5: "default",
          banner_0: "winningVariant",
          homepage_0: "winningVariant",
        });
      });
    });
  });
});

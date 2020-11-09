import jsCookie from 'js-cookie';
import * as R from 'ramda';
import initClient, { SplitsterClient } from '.';

// This is to ensure we can predictably set the winning variants
jest.mock('seedrandom', () => () => () => 1);

afterAll(() => {
  jest.restoreAllMocks();
});

const BASIC_CONFIG = {
  tests: {
    banner: {
      variants: {
        A: 2,
        B: 3,
        winningVariant: 1000
      }
    },
    loginButton: {
      variants: {
        default: 2,
        polite: 3,
        superdupercool: 4
      }
    }
  }
};

const EMPTY_CONFIG = {};

const EMPTY_TESTS_CONFIG = {
  tests: {}
};

const CONFIG_WITH_OPTIONS = {
  tests: {},
  options: {}
};
const CONFIG_WITH_COOKIES_ENABLED = {
  tests: {},
  options: {
    cookies: {
      disabled: false
    }
  }
};

describe('SplitsterClient', () => {
  // it("should ")

  // const client = initClient(BASIC_CONFIG)

  describe('constructor', () => {
    it('initialises values', () => {
      const CONFIGS = [
        EMPTY_CONFIG,
        EMPTY_TESTS_CONFIG,
        BASIC_CONFIG,
        CONFIG_WITH_OPTIONS,
        CONFIG_WITH_COOKIES_ENABLED
      ];
      const USER_CONFIGS = [ {}, { lang: 'en' } ];
      const USER_IDs = [ null, '', 'some-random-id' ];
      CONFIGS.forEach((config) => {
        USER_CONFIGS.forEach((userConfig) => {
          USER_IDs.forEach((userId) => {
            const client = new SplitsterClient({
              config,
              user: userConfig,
              userId
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
                winningVariant: undefined
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

  describe('get', () => {
    it(`should return an object with key "value" and value null
        if the testId passed in arguments is not found within the
        configured tests`, () => {
      const spy = jest.spyOn(global.console, 'warn').mockImplementation();

      const clientWithNoTests = initClient({
        tests: {}
      });
      expect(clientWithNoTests.get()).toEqual({ value: null });
      expect(spy).toHaveBeenCalledWith(
        'Splitster: Trying to access not existing test: undefined, your value will be null.'
      );

      expect(clientWithNoTests.get('some-test-id')).toEqual({ value: null });
      expect(spy).toHaveBeenCalledWith(
        'Splitster: Trying to access not existing test: some-test-id, your value will be null.'
      );

      const clientWithSomeTests = initClient({
        tests: {
          newBanner: {
            variants: {
              A: 2,
              B: 3
            }
          }
        }
      });
      expect(clientWithSomeTests.get('newBanner')).not.toEqual({ value: null });
      expect(clientWithSomeTests.get('some-unknown-test-id')).toEqual({
        value: null
      });
      expect(spy).toHaveBeenCalledWith(
        'Splitster: Trying to access not existing test: some-unknown-test-id, your value will be null.'
      );
      spy.mockRestore();
    });

    it(`should return an object with key "value" and value the winning variant`, () => {
      const clientWithSomeTests = initClient({
        tests: {
          banner: {
            variants: {
              A: 2,
              B: 3,
              winningVariant: 1000
            }
          },
          loginButton: {
            variants: {
              default: 2,
              polite: 3,
              superdupercool: 4
            }
          }
        }
      });
      expect(clientWithSomeTests.get('banner')).toEqual({
        value: 'winningVariant'
      });
      expect(clientWithSomeTests.get('loginButton')).toEqual({
        value: 'superdupercool'
      });
    });
  });

  describe('set', () => {
    it('returns a new instance of the client', () => {
      const client = initClient({
        tests: {}
      });

      const modifiedClient = client.set('someTestId', 'someVariantId');
      expect(modifiedClient).toBeInstanceOf(SplitsterClient);
    });
    it('returns a new instance of the client, even with edge case values', () => {
      const client = initClient({
        tests: {}
      });
      const edgeCases = [ null, undefined, '', {} ];
      edgeCases.forEach((edgeCase) => {
        edgeCases.forEach((edgeCase2) => {
          expect(client.set(edgeCase, edgeCase2).get(edgeCase)).toEqual({
            value: edgeCase2
          });
        });
      });
    });
    it('returns a new instance of the client with updated winning variant for the given testId', () => {
      const client = initClient({
        tests: {
          banner: {
            variants: {
              A: 2,
              B: 3,
              winningVariant: 1000
            }
          },
          loginButton: {
            variants: {
              default: 2,
              polite: 3,
              superdupercool: 4
            }
          }
        }
      });
      expect(client.get('banner')).toEqual({
        value: 'winningVariant'
      });
      expect(client.get('loginButton')).toEqual({
        value: 'superdupercool'
      });
      const modifiedClient = client.set('banner', 'A');
      // This test's winning variant is updated
      expect(modifiedClient.get('banner')).toEqual({ value: 'A' });
      // Other test's winning variant is preserved
      expect(modifiedClient.get('loginButton')).toEqual({
        value: 'superdupercool'
      });
    });
    it('returns a new instance of the client with updated winning variant for the given testId, even if testId is not present in original client configuration object', () => {
      const spy = jest.spyOn(global.console, 'warn').mockImplementation();
      const client = initClient({
        tests: {
          banner: {
            variants: {
              A: 2,
              B: 3,
              winningVariant: 1000
            }
          }
        }
      });
      expect(client.get('banner')).toEqual({
        value: 'winningVariant'
      });
      expect(client.get('unknownTestId')).toEqual({
        value: null
      });
      expect(spy).toHaveBeenCalledWith(
        'Splitster: Trying to access not existing test: unknownTestId, your value will be null.'
      );
      const modifiedClient = client.set('unknownTestId', 'A');
      // This test's winning variant is updated
      expect(modifiedClient.get('unknownTestId')).toEqual({ value: 'A' });
      // Other test's winning variant is preserved
      expect(modifiedClient.get('banner')).toEqual({
        value: 'winningVariant'
      });

      spy.mockRestore();
    });
    it('returns a new instance of the client with updated winning variant for the given testId, even if variantId is not present in the initial configuration object', () => {
      const client = initClient({
        tests: {
          banner: {
            variants: {
              A: 2,
              B: 3,
              winningVariant: 1000
            }
          }
        }
      });
      expect(client.get('banner')).toEqual({
        value: 'winningVariant'
      });
      const modifiedClient = client.set('banner', 'amazing');
      // This test's winning variant is updated
      expect(modifiedClient.get('banner')).toEqual({ value: 'amazing' });
    });
    it('returns a new instance of the client with updated winning variant for the given testId, even if neither the testId nor variantId are present in the initial configuration object', () => {
      const client = initClient({
        tests: {}
      });
      const modifiedClient = client.set('banner', 'A');
      expect(modifiedClient.get('banner')).toEqual({ value: 'A' });
    });
    it('sets the related cookie if instructed to do so', () => {
      jest.mock('js-cookie', () => ({
        get: () => 'lorem',
        set: jest.fn()
      }));
      const spy = jest.spyOn(jsCookie, 'set');

      // TODO It does not work if the tests are {}
      const client = initClient({
        tests: {
          banner: {
            A: 1,
            B: 1
          }
        }
      });
      const modifiedClient = client.set('banner', 'A');
      expect(spy).not.toHaveBeenCalled();
      const modifiedClient2 = client.set('banner', 'B', true);
      expect(spy).toHaveBeenCalledWith(`splitster_banner_0`, 'B');
      const modifiedClient3 = modifiedClient2.set('banner', 'A', true);
      expect(spy).toHaveBeenCalledWith(`splitster_banner_0`, 'A');

      spy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('getSaveResults', () => {
    it('should should return an empty object when no tests are provided', () => {
      const client = initClient(EMPTY_TESTS_CONFIG);
      expect(client.getSaveResults()).toEqual({});
    });
    it('should should return the winning variant id for each test', () => {
      const client = initClient({
        tests: {
          test1: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3,
              winningVariant: 100
            }
          },
          test2: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3
            }
          },
          test3: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3
            },
            disabled: true,
            disabledReason: 'because it is not ready yet'
          }
        }
      });
      expect(client.getSaveResults()).toEqual({
        test1: 'winningVariant',
        test2: 'variant3',
        test3: '__disabled_because it is not ready yet'
      });
    });
    it('should should return the winning variant id for each test, with the version in the testId', () => {
      const client = initClient({
        tests: {
          test1: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3,
              winningVariant: 100
            },
            version: 5
          },
          test2: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3
            }
          }
        }
      });
      expect(client.getSaveResults(true)).toEqual({
        test1_5: 'winningVariant',
        test2_0: 'variant3'
      });
    });
    it('should should return the winning variant id for each test, with the version in the testId', () => {
      const client = initClient({
        tests: {
          test1: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3,
              winningVariant: 100
            },
            defaultVariant: 'variant1',
            disabled: true
          },
          test2: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3
            }
          }
        }
      });
      expect(client.getSaveResults(false, true)).toEqual({
        test1: 'variant1',
        test2: 'variant3'
      });
    });
    it('should should return the winning variant id for each test, with the version in the testId', () => {
      const client = initClient({
        tests: {
          test1: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3,
              winningVariant: 100
            },
            defaultVariant: 'variant1',
            disabled: true,
            version: 5
          },
          test2: {
            variants: {
              variant1: 1,
              variant2: 2,
              variant3: 3
            }
          }
        }
      });
      expect(client.getSaveResults(true, true)).toEqual({
        test1_5: 'variant1',
        test2_0: 'variant3'
      });
    });
  });
});

describe('initClient', () => {
  it('should initialise a new SplitsterClient', () => {
    const client = initClient(EMPTY_TESTS_CONFIG);
    expect(client).toBeInstanceOf(SplitsterClient);
  });

  it('should set default values', () => {
    const client = initClient(EMPTY_TESTS_CONFIG);
    expect(client.tests).toEqual(EMPTY_TESTS_CONFIG.tests);
    expect(client.tests).toEqual(EMPTY_TESTS_CONFIG.tests);
  });
});

// We adjust seedrandom to predictably target the winningVariant
const mockSeedRandomImplementation = (_key) => {
  return () => null;
};

const config = {
  tests: {},
};

export const EMPTY_TESTS_CONFIG = { mockSeedRandomImplementation, config };

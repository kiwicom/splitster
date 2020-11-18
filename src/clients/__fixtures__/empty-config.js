// We adjust seedrandom to predictably target the winningVariant
const mockSeedRandomImplementation = (_key) => {
  return () => null;
};

const config = {};

export const EMPTY_CONFIG = { mockSeedRandomImplementation, config };

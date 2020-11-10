// We adjust seedrandom to predictably target the winningVariant
const mockSeedRandomImplementation = (key) => {
  return () => null
};

const config = {
  tests: {},
  options: {}
};

export const CONFIG_WITH_OPTIONS = {mockSeedRandomImplementation, config}

// We adjust seedrandom to predictably target the winningVariant
const mockSeedRandomImplementation = (key) => {
  return () => null
};

const CONFIG_ENABLED = {
  tests: {},
  options: {
    cookies: {
      disabled: false
    }
  }
};
const CONFIG_DISABLED = {
  tests: {},
  options: {
    cookies: {
      disabled: true
    }
  }
};

export const  CONFIG_WITH_COOKIES_ENABLED  = {mockSeedRandomImplementation, config: CONFIG_ENABLED}
export  const CONFIG_WITH_COOKIES_DISABLED  = {mockSeedRandomImplementation, config: CONFIG_DISABLED}

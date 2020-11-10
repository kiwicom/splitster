// We adjust seedrandom to predictably target the winningVariant
const mockSeedRandomImplementation = (key) => {
    if (key === "banner_0:undefined") return () => 1;
    if (key === "loginButton_0:undefined") return () => 0.35;
    if (key === "loginButton_5:undefined") return () => 0.95;
    if (key === "homepage_0:undefined") return () => 0.01;
    return () => null
};

const config = {
  tests: {
    banner: {
      variants: {
        A: 2,
        B: 3,
        winningVariant: 5
      }
    },
    loginButton: {
      variants: {
        default: 2,
        winningVariant: 3,
        superdupercool: 4
      }
    },
    homepage: {
      variants: {
        winningVariant: 1,
        default: 2,
        light: 4
      }
    }
  }
};

const CONFIG_WITH_DISABLED_WITH_REASON = {
  ...config,
  tests: {
    ...config.tests,
    homepage: {
      ...config.tests.homepage,
      disabled: true,
      disabledReason: 'because it is not ready yet'
    }
  }
}
const CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT = {
  ...config,
  tests: {
    ...config.tests,
    homepage: {
      ...config.tests.homepage,
      disabled: true,
      defaultVariant: 'default'
    }
  }
}

const CONFIG_WITH_VERSION = {
  ...config,
  tests: {
    ...config.tests,
    loginButton: {
      ...config.tests.loginButton,
      version: 5,
    }
  }
}
const CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT_WITH_VERSION = {
  ...config,
  tests: {
    ...config.tests,
    loginButton: {
      ...config.tests.loginButton,
      disabled: true,
      defaultVariant: 'default',
      version: 5,
    }
  }
}

export const BASIC_CONFIG = {mockSeedRandomImplementation, config}
export const BASIC_CONFIG_WITH_DISABLED_WITH_REASON = {mockSeedRandomImplementation, config: CONFIG_WITH_DISABLED_WITH_REASON}
export const BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT = {mockSeedRandomImplementation, config: CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT}
export const BASIC_CONFIG_WITH_VERSION = {mockSeedRandomImplementation, config: CONFIG_WITH_VERSION}
export const BASIC_CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT_WITH_VERSION = {mockSeedRandomImplementation, config: CONFIG_WITH_DISABLED_WITH_DEFAULT_VARIANT_WITH_VERSION}

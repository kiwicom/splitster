// @flow
import type { Config } from "../../../src/index";

export const BUTTON_COLOR = "BUTTON_COLOR";

const CONSOLE = "CONSOLE";

const config: Config = {
  tests: {
    BUTTON_COLOR: {
      defaultVariant: "red",
      variants: {
        red: {
          value: "RED",
          ratio: 1
        },
        blue: {
          value: "BLUE",
          ratio: 1
        }
      },
      version: 7
    },
    SHOW_ADD: {
      defaultVariant: "show",
      disabled: false,
      version: 7,
      usage: 100,
      variants: {
        show: {
          value: "SHOW",
          ratio: 1
        },
        hide: {
          value: "HIDE",
          ratio: 1
        }
      }
    },
    MODAL: {
      defaultVariant: "hello",
      variants: {
        hello: 1,
        world: 1
      }
    },
    // __disabled_usage
    UNIVERSE_QUESTION: {
      defaultVariant: "wise",
      usage: 0,
      variants: {
        wise: 1,
        dumb: 1
      }
    },
    // __disable_user_group
    KEK: {
      defaultVariant: "lol",
      variants: {
        lol: 1,
        bur: 1
      },
      userGroup: { lang: ["de", "us"] }
    },
    BUR: {
      defaultVariant: "lol",
      variants: {
        lol: 1,
        kek: 1
      },
      userGroupExclude: { lang: ["en"] }
    }
  },
  options: {
    cookies: {
      disabled: false,
      cookiesOptions: {
        expires: 30
      }
    }
  }
};

export default config;

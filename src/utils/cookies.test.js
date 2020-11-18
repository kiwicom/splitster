import { filterCookiesByPrefix, parseCookies } from "./cookies";

const RANDOM_COOKIES = {
  "random-cookie": "value3",
  random_cookie: "value4",
  whatever: "value5",
  rand0mC00kie: "value6",
};

describe("filterCookiesByPrefix", () => {
  it("should return cookies specific to Splitster", () => {
    const SPLITSTER_COOKIES = {
      "splitster_test_show_widget=show": "value",
      "splitster_test_button_color=red": "value2",
    };
    const SPLITSTER_COOKIES_KEYS = Object.keys(SPLITSTER_COOKIES);
    const COOKIES = {
      ...SPLITSTER_COOKIES,
      ...RANDOM_COOKIES,
    };
    expect(filterCookiesByPrefix(COOKIES)).toEqual(SPLITSTER_COOKIES_KEYS);
  });

  it("should return cookies specific to Splitster -- CUSTOM PREFIX", () => {
    const prefix = "my great prefix";
    const SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX = {
      [`${prefix}test_show_widget=show`]: "value",
      [`${prefix}test_button_color=red`]: "value2",
    };
    const SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX_KEYS = Object.keys(
      SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX,
    );
    const COOKIES = {
      ...SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX,
      ...RANDOM_COOKIES,
    };
    expect(filterCookiesByPrefix(COOKIES, prefix)).toEqual(
      SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX_KEYS,
    );
  });
});

describe("parseCookies", () => {
  it("returns Splitster specific cookies with the prefix removed from the cookie key", () => {
    const SPLITSTER_COOKIES = {
      "splitster_test_show_widget=show": "value",
      "splitster_test_button_color=red": "value2",
    };
    const SPLITSTER_COOKIES_WITHOUT_PREFIX = {
      "test_show_widget=show": "value",
      "test_button_color=red": "value2",
    };
    const COOKIES = {
      ...SPLITSTER_COOKIES,
      ...RANDOM_COOKIES,
    };
    expect(parseCookies(COOKIES)).toEqual(SPLITSTER_COOKIES_WITHOUT_PREFIX);
  });

  it("parses Splitster specific cookies with the prefix removed from the cookie key -- CUSTOM PREFIX", () => {
    const prefix = "my great prefix";
    const SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX = {
      [`${prefix}test_show_widget=show`]: "value",
      [`${prefix}test_button_color=red`]: "value2",
    };
    const SPLITSTER_COOKIES_WITHOUT_PREFIX = {
      "test_show_widget=show": "value",
      "test_button_color=red": "value2",
    };
    const COOKIES = {
      ...SPLITSTER_COOKIES_WITH_CUSTOM_PREFIX,
      ...RANDOM_COOKIES,
    };
    expect(parseCookies(COOKIES, prefix)).toEqual(SPLITSTER_COOKIES_WITHOUT_PREFIX);
  });
});

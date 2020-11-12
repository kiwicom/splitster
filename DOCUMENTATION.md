## What is Splitster?

Splitster is a JavaScript AB testing tool. Given a list of AB tests with different possible variants, Splitster randomnly chooses a variant for a given user and this choice is deterministic from the user's id.

### Basic flow

__NOTE: this example is incomplete for correct setup in production, it is meant as an introduction to how Splitster works.__

For example, let's say we want to test a new banner and there are two options: either it's hidden (essentially no change from current situation) or it's visible. We could encode this as follows:
```js
const tests = {
  // test id
  banner: {
    defaultVariant: 'hidden',
    variants: {
      hidden: 1,
      visible: 0
    },
    description: 'New banner showing promotional information',
  }
}
```

When you query Splitster for `banner` (the test id of this test), this configuration will basically ensure that the chosen variant for any user is `'hidden'`.

```js
import { init } from '@kiwicom/splitster';

// Somewhere where your app is initialised
const tests = {
  // test id
  banner: {
    defaultVariant: 'hidden',
    variants: {
      hidden: 1,
      visible: 0
    },
    description: 'New banner showing promotional information',
  }
}
// The roles of user and userId will be explained below
const SplitsterClient = init({ tests, user: {}, userId: '' });

// Somewhere else in your application

const shouldShowBanner = SplitsterClient.get('banner').value === "visible"; // false

if (shouldShowBanner) { // will not execute
  // logic to render banner
}
```

The new banner is now ready to be tested so you want that 10% of your users get to see it. You would update the configuration file as follows:
```diff
const tests = {
  // test id
  banner: {
    defaultVariant: 'hidden',
    variants: {
-      hidden: 1,
-      visible: 0
+      hidden: 90,
+      visible: 10
    },
    description: 'New banner showing promotional information',
  }
}
```

The numbers assigned to the variant ids correspond to relative weights.

**However, in the current setup, all our users will get the same value!** 😱

This is because we haven't set the user id when initialising Splitster, which essentially means that all users are the same user in the eyes of Splitster and as result all will get the same variant.

### Importance of setting `userId` correctly

The previous example is not production ready for the simple reason that **everyone** will get the same version. (If you'd like more details, this is because Splitster relies under the hood on the `seedrandom` library which creates a stack of random numbers and does it deterministically if a seed was provided).

You need a way to identify your users to provide the same variants through Splitster. For example, we could use some UUID generator and assign it to our users through a cookie, if they don't already have a cookie with given value.

We can now use this value for `userId` when initialising the Splitster client.

<!-- 

What's more, Splitster will set a corresponding cookie on the client. In this example, the cookie with key `__splitster_banner_0` would be set with value `hidden`.

The `0` in the cookie corresponds to the version of the test, which is 0 by default. (This can come in useful when you want to load the Splitster configuration from a remote source) -->

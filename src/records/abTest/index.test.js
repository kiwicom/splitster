import { getTestFromConfig, getTestsFromConfig } from '.';

// describe('getTestFromConfig', () => {
//   // it('should ', () => {
//   //   // const tests = {
//   //   //   variants: {
//   //   //     variantA: 1,
//   //   //     variantB: 1,
//   //   //     variantC: 1
//   //   //   }
//   //   // };
//   //   // const options = {
//   //   //   override: {}
//   //   // };

//   //   const func = getTestFromConfig({ override: {}, user: {}, userId: '' });

//   //   expect(
//   //     func({})({variants: {}})
//   //   ).toEqual();
//   // });
// });
describe('getTestsFromConfig', () => {
  it('should ', () => {
    const tests = {
      variants: {
        variantA: 1,
        variantB: 1,
        variantC: 1
      }
    };
    const options = {
      override: {}
    };
    expect(getTestsFromConfig(tests, options)).toEqual({
      variants: {
        disabled: false,
        disabledReason: null,
        variantA: 1,
        variantB: 1,
        variantC: 1,
        winningVariant: undefined
      }
    });
  });
});

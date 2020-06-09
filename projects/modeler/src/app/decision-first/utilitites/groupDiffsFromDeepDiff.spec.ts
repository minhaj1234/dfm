import { diff } from 'deep-diff';
import { groupDiffs } from './groupDiffsFromDeepDiff';

describe('groupDiffsFromDeepDiff', () => {
  it('groups the diffs by change type and ignores those specified', () => {
    const left = {
      a: {
        hello: 'good day',
        ignoreMe: 'ok',
      },
      b: {
        goodbye: 'good day',
      },
      c: {
        afternoon: 'good afternoon',
      },
      e: {
        whatsup: 'what is up?',
      },
      g: {
        someOtherGreeting: 'hey dude',
      },
    };
    const right = {
      a: {
        hello: 'hola',
        ignoreMe: 'you got it',
      },
      b: {
        goodbye: 'good day',
      },
      d: {
        goodnight: 'buenas noches',
      },
      e: {
        whatsup: 'que pasa?',
      },
      f: {
        goodmorning: 'buenas diaz',
      },
    };
    const diffs = diff(left, right);
    const toOmitFromCompare = { ignoreMe: true };
    const grouped = groupDiffs(diffs, toOmitFromCompare);
    expect(grouped).toEqual({
      D: [diffs[2], diffs[4]],
      E: [diffs[0], diffs[3]],
      N: [diffs[5], diffs[6]],
    });
  });
});

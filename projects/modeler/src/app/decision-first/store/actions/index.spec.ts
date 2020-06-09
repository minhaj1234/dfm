import * as fromActions from './';

describe('No Op', () => {
  it('should create an action', () => {
    const action = new fromActions.NoOpAction();
    expect({ ...action }).toEqual({
      type: 'NO OP',
    });
  });
});

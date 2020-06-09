import * as fromActions from './no-op.action';

describe('No Op', () => {
  it('should create an action', () => {
    const action = new fromActions.NoOpAction();
    expect({ ...action }).toEqual({
      type: 'NO OP',
    });
  });
});

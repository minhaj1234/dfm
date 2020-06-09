import * as fromActions from '../../actions';
import * as fromDecisions from '../../reducers/version-information/version-information.reducer';

describe(`${fromActions.LOAD_VERSION_INFORMATION_SUCCESS} action`, () => {
  it('should change state', () => {
    const { initialState } = fromDecisions;
    const action = new fromActions.LoadVersionInformationSuccess({
      information: 'new informationn',
      supportLink: 'new supportLink'
    });

    const state = fromDecisions.reducer(initialState, action);

    expect(state).toEqual({
      information: 'new informationn',
      supportLink: 'new supportLink'
    });
  });
});

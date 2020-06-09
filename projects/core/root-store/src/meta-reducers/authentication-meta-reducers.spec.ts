import * as formAuth0UserProvidedMetaReducers from './authentication-meta-reducers';

describe('AuthenticationMetaReducers', () => {
  describe('getUserProvidedMetaReducers', () => {
    it('should return meta reducers array', () => {
        const metaReducers = formAuth0UserProvidedMetaReducers.getUserMetaReducers();

        expect(metaReducers.length).toBeTruthy();
    });

    it('should return same array when recall', () => {
      const metaReducersFirstCall = formAuth0UserProvidedMetaReducers.getUserMetaReducers();
      const metaReducersSecondCall = formAuth0UserProvidedMetaReducers.getUserMetaReducers();

      expect(metaReducersFirstCall).toEqual(metaReducersSecondCall);
    });
  });
});

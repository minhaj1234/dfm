import { Params } from '@angular/router';
import { CustomSerializer } from './router.reducer';

class FakeActivatedRouterSnapshot {
  url: string;
  queryParams: Params;
  firstChild: FakeActivatedRouterSnapshot;
  params: Params;
  get root() {
    return this;
  }
}

describe('Router Reducer', () => {
  describe('CustomSerializer', () => {
    let customSerializer: CustomSerializer;
    let parentSnapshot: FakeActivatedRouterSnapshot;

    beforeEach(() => {
      customSerializer = new CustomSerializer();
      const grandchildSnapshot = new FakeActivatedRouterSnapshot();
      grandchildSnapshot.params = {
        id: 'some id',
      };

      const childSnapshot = new FakeActivatedRouterSnapshot();
      childSnapshot.firstChild = grandchildSnapshot;

      parentSnapshot = new FakeActivatedRouterSnapshot();
      parentSnapshot.firstChild = childSnapshot;
      parentSnapshot.url = 'http://localhost/test';
      parentSnapshot.queryParams = {
        id: 'decision1',
        type: 'decision',
      };
    });

    it('returns the correct snapshot', () => {
      expect(customSerializer.serialize(parentSnapshot as any)).toEqual({
        params: {
          id: 'some id',
        },
        queryParams: {
          id: 'decision1',
          type: 'decision',
        },
        url: 'http://localhost/test',
      });
    });
  });
});

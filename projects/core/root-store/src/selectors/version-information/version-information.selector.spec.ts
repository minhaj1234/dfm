import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { VersionInformation } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { TestStoreModule } from 'core/testing';
import * as fromActions from '../../actions';

describe('Decisions Selectors', () => {
  let store: Store<rootReducers.versionInformationReducer.IVersionInformationState>;

  const versionInformation = {
    information: 'information',
    supportLink: 'supportLink',
  } as VersionInformation;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getVersionInformation', () => {
    it('should return the version information', () => {
      let result;

      store.pipe(select(rootSelectors.getVersionInformation)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual({
        information: '',
        supportLink: '',
      });

      store.dispatch(new fromActions.LoadVersionInformationSuccess(versionInformation));
     

      expect(result).toEqual(versionInformation);
    });
  });
});

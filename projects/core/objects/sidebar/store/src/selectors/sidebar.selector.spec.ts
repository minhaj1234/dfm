import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { SidebarPanel } from 'core/objects/sidebar/models';
import { TestStoreModule } from 'core/testing';
import * as fromSidebarActions from '../actions/sidebar.actions';
import * as fromReducers from '../reducers';
import * as fromSidebarSelectors from './sidebar.selector';

describe('Sidebar Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstSidebarState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getCurrentPanelSidebar', () => {
    it('should return the current sidebar panel', () => {
      let result;

      store.pipe(select(fromSidebarSelectors.getCurrentPanelSidebar)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(SidebarPanel.Navigation);

      store.dispatch(new fromSidebarActions.SetCurrentSidebarPanel(SidebarPanel.ExistingObjects));

      expect(result).toEqual(SidebarPanel.ExistingObjects);
    });
  });

  describe('getIsShowPropertySidebar', () => {
    it('should return the is show property', () => {
      let result;

      store.pipe(select(fromSidebarSelectors.getIsShowPropertySidebar)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromSidebarActions.ExpandSidebar());

      expect(result).toEqual(true);
    });
  });

  describe('getIsPinnedPropertySidebar', () => {
    it('should return the is pinned property', () => {
      let result;

      store.pipe(select(fromSidebarSelectors.getIsPinnedPropertySidebar)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromSidebarActions.SetIsPinnedPropertySidebar(true));

      expect(result).toEqual(true);
    });
  });
});

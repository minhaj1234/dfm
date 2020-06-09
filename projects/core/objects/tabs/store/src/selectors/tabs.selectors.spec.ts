import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { DefaultJumpMenuSelectedItem, ITab, ObjectTabType } from 'core/models';
import { TestStoreModule } from 'core/testing';
import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from './tabs.selectors';

describe('Tabs Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstTabsState>;

  const tabs: ITab[] = [
    {
      id: 'diagram1',
      type: ObjectTabType.Diagram,
      jumpMenuSelectedItem: DefaultJumpMenuSelectedItem
    },
    {
      id: 'diagram2',
      type: ObjectTabType.Diagram,
      jumpMenuSelectedItem: DefaultJumpMenuSelectedItem
    },
    {
      id: 'diagram3',
      type: ObjectTabType.Diagram,
      jumpMenuSelectedItem: DefaultJumpMenuSelectedItem
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getAllTabs', () => {
    it('should return the tabs in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getAllTabs)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.AddTab(tabs[0]));
      store.dispatch(new fromActions.AddTab(tabs[1]));
      store.dispatch(new fromActions.AddTab(tabs[2]));

      expect(result).toEqual([...tabs]);
    });
  });

  describe('isTabOpen', () => {
    it('returns true if the tab is open', () => {
      let result;

      store.pipe(select(fromSelectors.isTabOpen('diagram1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(false);

      store.dispatch(new fromActions.AddTab(tabs[0]));
      store.dispatch(new fromActions.AddTab(tabs[1]));
      store.dispatch(new fromActions.AddTab(tabs[2]));

      expect(result).toEqual(true);
    });
  });

  describe('getCurrentTabIndex', () => {
    it('should return the current tab id', () => {
      let result;

      store.pipe(select(fromSelectors.getCurrentTabId)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual('');

      store.dispatch(new fromActions.AddTab(tabs[0]));
      store.dispatch(new fromActions.AddTab(tabs[1]));
      store.dispatch(new fromActions.AddTab(tabs[0]));

      expect(result).toEqual('diagram1');
    });
  });

  describe('getCurrentTabEntity', () => {
    it('should return the current tab index', () => {
      let result;

      store.pipe(select(fromSelectors.getCurrentTabEntity)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromActions.AddTab(tabs[0]));
      store.dispatch(new fromActions.AddTab(tabs[1]));
      store.dispatch(new fromActions.AddTab(tabs[0]));

      expect(result).toEqual(tabs[0]);
    });
  });
});

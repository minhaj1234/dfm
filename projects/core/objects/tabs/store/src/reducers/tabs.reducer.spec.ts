import { DefaultJumpMenuSelectedItem, ITab, JumpMenuItems, ObjectTabType } from 'core/models';
import * as fromActions from '../actions';
import * as fromTabs from './tabs.reducer';

describe('Tabs Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromTabs;
      const action = {} as any;

      const state = fromTabs.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.ADD_TAB} action`, () => {
    it('should set the state and set the selected tab to the recently added tab', () => {
      const { initialState } = fromTabs;
      const action = new fromActions.AddTab({ id: 'uuid', type: ObjectTabType.Diagram });

      const state = fromTabs.reducer(initialState, action);

      expect(state.selectedTab).toBe('uuid');
      expect(state.ids).toEqual(['uuid']);
    });

    it('updates the index if the tab has already been added', () => {
      const { initialState } = fromTabs;
      let state = fromTabs.reducer(initialState, new fromActions.AddTab({ id: 'uuid1', type: ObjectTabType.Diagram }));
      state = fromTabs.reducer(state, new fromActions.AddTab({ id: 'uuid2', type: ObjectTabType.Diagram }));
      const action = new fromActions.AddTab({ id: 'uuid1', type: ObjectTabType.Diagram });

      state = fromTabs.reducer(state, action);

      expect(state.selectedTab).toBe('uuid1');
      expect(state.ids).toEqual(['uuid1', 'uuid2']);
    });
  });

  describe(`${fromActions.REMOVE_TAB} action`, () => {
    it('should set the state', () => {
      const { initialState } = fromTabs;
      let state = fromTabs.reducer(initialState, new fromActions.AddTab({ id: 'uuid', type: ObjectTabType.Diagram }));
      const action = new fromActions.RemoveTab('uuid');

      state = fromTabs.reducer(state, action);

      expect(state.ids).toEqual([]);
    });
  });

  describe(`${fromActions.SET_SELECTED_TAB} action`, () => {
    it('should set the diagrams', () => {
      const { initialState } = fromTabs;
      const action = new fromActions.SetSelectedTab({ id: 'uuid1', type: ObjectTabType.Diagram });

      const state = fromTabs.reducer(initialState, action);

      expect(state.selectedTab).toBe('uuid1');
    });
  });

  describe(`${fromActions.REMOVE_TAB} action`, () => {
    let setupState;
    beforeEach(() => {
      const { initialState } = fromTabs;
      const tab1: ITab = { id: 'diagram1', type: ObjectTabType.Diagram };
      const tab2: ITab = { id: 'diagram2', type: ObjectTabType.Diagram };
      const tab3: ITab = { id: 'diagram3', type: ObjectTabType.Diagram };
      setupState = fromTabs.reducer(initialState, new fromActions.AddTab(tab1));
      setupState = fromTabs.reducer(setupState, new fromActions.AddTab(tab2));
      setupState = fromTabs.reducer(setupState, new fromActions.AddTab(tab3));
    });

    it('can remove one if it is not the current tab', () => {
      const action = new fromActions.RemoveTab('diagram1');
      const state = fromTabs.reducer(setupState, action);

      expect(state.ids).not.toContain('diagram1');
      expect(state.entities.diagram1).toBeUndefined();
    });

    it('picks the tab to the left if the user removes the selected tab', () => {
      const action = new fromActions.RemoveTab('diagram3');
      const state = fromTabs.reducer(setupState, action);

      expect(state.selectedTab).toEqual('diagram2');
    });

    it('picks the tab to the right if the user removes the first tab when it is active', () => {
      const setupAction = new fromActions.SetSelectedTab({ id: 'diagram1', type: ObjectTabType.Diagram });
      setupState = fromTabs.reducer(setupState, setupAction);

      const action = new fromActions.RemoveTab('diagram1');
      const state = fromTabs.reducer(setupState, action);

      expect(state.selectedTab).toEqual('diagram2');
    });
  });

  describe('selectCurrentTab', () => {
    it('returns the correct entity', () => {
      const { initialState } = fromTabs;
      const tab: ITab = { id: 'uuid', type: ObjectTabType.Diagram };
      const state = fromTabs.reducer(initialState, new fromActions.AddTab(tab));

      const result = fromTabs.selectCurrentTab(state);
      expect(result).toBe('uuid');
    });
  });

  describe('selectCurrentEntity', () => {
    it('returns the correct tab', () => {
      const { initialState } = fromTabs;
      const currentEntity = fromTabs.selectCurrentEntity(initialState);
      expect(currentEntity).toBe(undefined);
    });
  });

  describe('selectCurrentEntity', () => {
    it('returns the correct entity', () => {
      const { initialState } = fromTabs;
      const tab: ITab = { id: 'uuid', type: ObjectTabType.Diagram, jumpMenuSelectedItem: DefaultJumpMenuSelectedItem };
      const state = fromTabs.reducer(initialState, new fromActions.AddTab(tab));

      const result = fromTabs.selectCurrentEntity(state);
      expect(result).toEqual(tab);
    });
  });

  describe(`${fromActions.UPDATE_JUMP_MENU_SELECTED_ITEM_IN_TAB} action`, () => {
    it('should update selected jump menu item', () => {
      const { initialState } = fromTabs;
      const addTabAction = new fromActions.AddTab({ id: 'uuid', type: ObjectTabType.Decision, jumpMenuSelectedItem: JumpMenuItems.Comments });
      const stateAfterAdd = fromTabs.reducer(initialState, addTabAction);

      const updateTabAction = new fromActions.UpdateJumpMenuSelectedItemInTab({ id: 'uuid', jumpMenuSelectedItem: JumpMenuItems.BasicDetails });
      const stateAfterUpdate = fromTabs.reducer(stateAfterAdd, updateTabAction);

      expect(stateAfterUpdate.entities.uuid.jumpMenuSelectedItem).toEqual(JumpMenuItems.BasicDetails);
    });
  });
});

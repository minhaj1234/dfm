import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { DefaultJumpMenuSelectedItem, ITab } from 'core/models';
import * as fromActions from '../actions';

export interface ITabState extends EntityState<ITab> {
  selectedTab: string;
}

export const tabAdapter: EntityAdapter<ITab> = createEntityAdapter<ITab>();

export const initialState: ITabState = Object.assign(tabAdapter.getInitialState(), {
  selectedTab: '',
});

const actionMap: IActionMap<ITabState, fromActions.TabActions> = {
  [fromActions.ADD_TAB]: addTabHandler,
  [fromActions.REMOVE_TAB]: removeTabHandler,
  [fromActions.SET_SELECTED_TAB]: setSelectedTab,
  [fromActions.UPDATE_JUMP_MENU_SELECTED_ITEM_IN_TAB]: updateJumpMenuSelectedItemInTabHandler,
};

export function reducer(state: ITabState = initialState, action: fromActions.TabActions): ITabState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function addTabHandler(state: ITabState, action: fromActions.AddTab): ITabState {
  if (!state.entities[action.payload.id]) {
    const updatedCurrentTabIndexState = {
      ...state,
      selectedTab: action.payload.id,
    };
    return tabAdapter.addOne({
      id: action.payload.id,
      type: action.payload.type,
      objectType: action.payload.objectType,
      jumpMenuSelectedItem: action.payload.jumpMenuSelectedItem ? action.payload.jumpMenuSelectedItem : DefaultJumpMenuSelectedItem
    }, updatedCurrentTabIndexState);
  }
  return {
    ...state,
    selectedTab: action.payload.id,
  };
}

function removeTabHandler(state: ITabState, action: fromActions.RemoveTab): ITabState {
  if (state.selectedTab === action.payload) {
    const thisIndex = (state.ids as string[]).findIndex((id) => id === action.payload);
    let selectedTab = '';
    if (thisIndex - 1 >= 0) {
      selectedTab = state.ids[thisIndex - 1] as string;
    } else if (state.ids.length - 1 > 0) {
      selectedTab = state.ids[1] as string;
    }
    state = {
      ...state,
      selectedTab,
    };
  }
  return tabAdapter.removeOne(action.payload, state);
}

function setSelectedTab(state: ITabState, action: fromActions.SetSelectedTab): ITabState {
  return {
    ...state,
    selectedTab: action.payload.id,
  };
}

function updateJumpMenuSelectedItemInTabHandler(
  state: ITabState,
  action: fromActions.UpdateJumpMenuSelectedItemInTab,
): ITabState {
  return tabAdapter.updateOne(
    { id: action.payload.id, changes: { jumpMenuSelectedItem: action.payload.jumpMenuSelectedItem } },
    state,
  );
}

export const { selectAll, selectEntities } = tabAdapter.getSelectors();
export const selectCurrentTab = (state: ITabState) => state.selectedTab;
export const selectCurrentEntity = (state: ITabState) => state.entities[state.selectedTab];

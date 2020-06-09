import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromActions from '../../actions/implementation-component/implementationComponentsList.action';

export interface IImplementationComponentsListState
  extends EntityState<ImplementationComponent>,
    StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const implementationComponentsListAdapter: EntityAdapter<ImplementationComponent> = createEntityAdapter<
  ImplementationComponent
>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IImplementationComponentsListState = {
  ...implementationComponentsListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IImplementationComponentsListState, fromActions.ImplementationComponentsListActions> = {
  [fromActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST]: loadImplementationComponentsListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_IMPLEMENTATION_COMPONENTS_LIST]: loadSpecificPageForImplementationComponentsListHandler,
  [fromActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST_SUCCESS]: loadImplementationComponentsListSuccessHandler,
  [fromActions.IMPLEMENTATION_COMPONENTS_LIST_FAILURE]: implementationComponentsListFailureHandler,
};

export function reducer(
  state: IImplementationComponentsListState = initialState,
  action: fromActions.ImplementationComponentsListActions,
): IImplementationComponentsListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadImplementationComponentsListHandler(
  state: IImplementationComponentsListState,
  action: fromActions.LoadImplementationComponentsList,
): IImplementationComponentsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForImplementationComponentsListHandler(
  state: IImplementationComponentsListState,
  action: fromActions.LoadSpecificPageForImplementationComponentsList,
): IImplementationComponentsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadImplementationComponentsListSuccessHandler(
  state: IImplementationComponentsListState,
  action: fromActions.LoadImplementationComponentsListSuccess,
): IImplementationComponentsListState {
  return {
    ...implementationComponentsListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function implementationComponentsListFailureHandler(
  state: IImplementationComponentsListState,
  action: fromActions.ImplementationComponentsListFailure,
): IImplementationComponentsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = implementationComponentsListAdapter.getSelectors();
export const getPagination = (state: IImplementationComponentsListState) => state.pagination;

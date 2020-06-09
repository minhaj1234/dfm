import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap, IPagination } from 'core/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import { Organization } from '../../../models/organization.model';
import * as fromActions from '../../actions/organization/organizationsList.actions';

export interface IOrganizationsListState extends EntityState<Organization>, StateWithNetworkActive {
  pagination: IPagination;
  searchTerm: string;
}

export const organizationsListAdapter: EntityAdapter<Organization> = createEntityAdapter<Organization>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IOrganizationsListState = {
  ...organizationsListAdapter.getInitialState(),
  ...networkAdapter.initialState,
  pagination: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
  searchTerm: '',
};

const actionMap: IActionMap<IOrganizationsListState, fromActions.OrganizationsListActions> = {
  [fromActions.LOAD_ORGANIZATIONS_LIST]: loadOrganizationsListHandler,
  [fromActions.LOAD_SPECIFIC_PAGE_FOR_ORGANIZATIONS_LIST]: loadSpecificPageForOrganizationsListHandler,
  [fromActions.LOAD_ORGANIZATIONS_LIST_SUCCESS]: loadOrganizationsListSuccessHandler,
  [fromActions.UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST]: updateSearchTermHandler,
  [fromActions.UPDATE_SINGLE_ORGANIZATION_IF_NEEDED]: updateSingleIfNeededHandler,
  [fromActions.REMOVE_SINGLE_ORGANIZATION_IF_NEEDED]: removeSingleIfNeededHandler,
  [fromActions.ORGANIZATIONS_LIST_FAILURE]: organizationsListFailureHandler,
};

export function reducer(
  state: IOrganizationsListState = initialState,
  action: fromActions.OrganizationsListActions,
): IOrganizationsListState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadOrganizationsListHandler(
  state: IOrganizationsListState,
  action: fromActions.LoadOrganizationsList,
): IOrganizationsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadSpecificPageForOrganizationsListHandler(
  state: IOrganizationsListState,
  action: fromActions.LoadSpecificPageForOrganizationsList,
): IOrganizationsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadOrganizationsListSuccessHandler(
  state: IOrganizationsListState,
  action: fromActions.LoadOrganizationsListSuccess,
): IOrganizationsListState {
  return {
    ...organizationsListAdapter.addAll(action.payload.results, state),
    ...networkAdapter.makeGenericInactive(state),
    pagination: action.payload.pagination,
  };
}

function updateSearchTermHandler(
  state: IOrganizationsListState,
  action: fromActions.UpdateSearchForOrganizationsList,
): IOrganizationsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
    searchTerm: action.payload,
  };
}

function updateSingleIfNeededHandler(
  state: IOrganizationsListState,
  action: fromActions.UpdateSingleOrganizationIfNeeded,
): IOrganizationsListState {
  return organizationsListAdapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
}

function removeSingleIfNeededHandler(
  state: IOrganizationsListState,
  action: fromActions.RemoveSingleElementFromOrganizationsList,
): IOrganizationsListState {
  return organizationsListAdapter.removeOne(action.payload, state);
}

function organizationsListFailureHandler(
  state: IOrganizationsListState,
  action: fromActions.OrganizationsListFailure,
): IOrganizationsListState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = organizationsListAdapter.getSelectors();
export const getSearchTerm = (state: IOrganizationsListState) => state.searchTerm;
export const getPagination = (state: IOrganizationsListState) => state.pagination;

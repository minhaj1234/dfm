import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { createNetworkAdapter, StateWithNetworkActive } from 'core/utilities';
import * as fromActions from '../../actions';

export interface IImplementationComponentsIconsState extends EntityState<ImplementationComponentIcon>, StateWithNetworkActive {
  displayUploadIconForm: boolean;
}

export const implementationComponentsIconsAdapter: EntityAdapter<ImplementationComponentIcon> = createEntityAdapter<
  ImplementationComponentIcon
>();
export const networkAdapter = createNetworkAdapter();

export const initialState: IImplementationComponentsIconsState = {
  displayUploadIconForm: false,
  ...implementationComponentsIconsAdapter.getInitialState(),
  ...networkAdapter.initialState,
};

const actionMap: IActionMap<IImplementationComponentsIconsState, fromActions.ImplementationComponentsIconsActions> = {
  [fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS]: loadImplementationComponentsIconsHandler,
  [fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS_SUCCESS]: loadImplementationComponentsIconsSuccessHandler,
  [fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON]: loadImplementationComponentsIconHandler,
  [fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS]: loadImplementationComponentsIconSuccessHandler,
  [fromActions.DELETE_IMPLEMENTATION_COMPONENTS_ICON]: deleteImplementationComponentsIconHandler,
  [fromActions.IMPLEMENTATION_COMPONENTS_ICONS_FAILURE]: implementationComponentsIconsFailureHandler,
  [fromActions.GENERIC_IMPLEMENTATION_COMPONENTS_ICONS_FAILURE]: genericImplementationComponentsIconsFailureHandler,
  [fromActions.UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS]: uploadImplementationComponentsIconSuccessHandler,
  [fromActions.OPEN_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM]: openUploadImplementationComponentsIconFormHandler,
  [fromActions.CLOSE_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM]: closeUploadImplementationComponentsIconFormHandler,
  [fromActions.REMOVE_IMPLEMENTATION_COMPONENTS_ICON_FROM_LOCAL_MEMORY]: removelementationComponentIconFromLocalMemoryHandler,
  [fromActions.FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENTS_ICONS]: finishedNetworkRequestForImplementationComponentsIconHandler,
};

export function reducer(
  state: IImplementationComponentsIconsState = initialState,
  action: fromActions.ImplementationComponentsIconsActions,
): IImplementationComponentsIconsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadImplementationComponentsIconsHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.LoadImplementationComponentsIcons,
): IImplementationComponentsIconsState {
  return {
    ...state,
    ...networkAdapter.makeGenericActive(state),
  };
}

function loadImplementationComponentsIconsSuccessHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.LoadImplementationComponentsIconsSuccess,
): IImplementationComponentsIconsState {
  return {
    ...implementationComponentsIconsAdapter.addAll(action.payload, state),
    ...networkAdapter.makeGenericInactive(state),
  };
}

function loadImplementationComponentsIconHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.LoadImplementationComponentsIcon,
): IImplementationComponentsIconsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}


function loadImplementationComponentsIconSuccessHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.LoadImplementationComponentsIconSuccess,
): IImplementationComponentsIconsState {
  return {
    ...implementationComponentsIconsAdapter.addOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function deleteImplementationComponentsIconHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.DeleteImplementationComponentsIcon,
): IImplementationComponentsIconsState {
  return {
    ...state,
    ...networkAdapter.makeOneActive(action.payload, state),
  };
}

function implementationComponentsIconsFailureHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.ImplementationComponentsIconsFailure,
): IImplementationComponentsIconsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload.id, state),
  };
}

function genericImplementationComponentsIconsFailureHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.GenericImplementationComponentsIconsFailure,
): IImplementationComponentsIconsState {
  return {
    ...state,
    ...networkAdapter.makeGenericInactive(state),
  };
}

function uploadImplementationComponentsIconSuccessHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.UploadImplementationComponentsIconSuccess,
): IImplementationComponentsIconsState {
  return {
    ...state,
    displayUploadIconForm: false,
  };
}

function openUploadImplementationComponentsIconFormHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.OpenUploadImplementationComponentsIconForm,
): IImplementationComponentsIconsState {
  return {
    ...state,
    displayUploadIconForm: true,
  };
}

function closeUploadImplementationComponentsIconFormHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.CloseUploadImplementationComponentsIconForm,
): IImplementationComponentsIconsState {
  return {
    ...state,
    displayUploadIconForm: false,
  };
}

function removelementationComponentIconFromLocalMemoryHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.RemovelementationComponentIconFromLocalMemory,
): IImplementationComponentsIconsState {
  return {
    ...implementationComponentsIconsAdapter.removeOne(action.payload, state),
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

function finishedNetworkRequestForImplementationComponentsIconHandler(
  state: IImplementationComponentsIconsState,
  action: fromActions.FinishedNetworkRequestForImplementationComponentsIcon,
): IImplementationComponentsIconsState {
  return {
    ...state,
    ...networkAdapter.makeOneInactive(action.payload, state),
  };
}

export const { selectAnyNetworkActive, selectGenericNetworkActive, selectNetworkActive } = networkAdapter.selectors;
export const { selectEntities, selectAll } = implementationComponentsIconsAdapter.getSelectors();

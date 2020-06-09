import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IActionMap } from 'core/models';
import { IActiveDiagram } from '../../../models/diagram.model';
import * as fromActions from '../../actions/diagram/activeDiagrams.action';

export interface IActiveDiagramsState extends EntityState<IActiveDiagram> {}

export const activeDiagramsAdapter: EntityAdapter<IActiveDiagram> = createEntityAdapter<IActiveDiagram>();

export const initialState: IActiveDiagramsState = Object.assign(activeDiagramsAdapter.getInitialState(), {});

const actionMap: IActionMap<IActiveDiagramsState, fromActions.ActiveDiagramActions> = {
  [fromActions.ADD_ACTIVE_DIAGRAM]: addActiveDiagramHandler,
  [fromActions.SET_LINK_TYPE_ACTIVE_DIAGRAM]: setLinkTypeActiveDiagramHandler,
  [fromActions.SET_SELECTED_DIAGRAM_OBJECTS_ACTIVE_DIAGRAM]: setSelectedDiagramObjectsActiveDiagramHandler,
  [fromActions.SET_SELECTED_SIDEBAR_TAB_TYPE]: setSelectedSidebarTabTypeHandler,
  [fromActions.SET_DIAGRAM_IMAGE_ACTIVE_DIAGRAM]: setDiagramImageActiveDiagramHandler,
  [fromActions.REMOVE_ACTIVE_DIAGRAM]: removeActiveDiagramHandler,
};

export function reducer(
  state: IActiveDiagramsState = initialState,
  action: fromActions.ActiveDiagramActions,
): IActiveDiagramsState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function addActiveDiagramHandler(
  state: IActiveDiagramsState,
  action: fromActions.AddActiveDiagram,
): IActiveDiagramsState {
  return activeDiagramsAdapter.addOne(action.payload, state);
}

function setLinkTypeActiveDiagramHandler(
  state: IActiveDiagramsState,
  action: fromActions.SetLinkTypeActiveDiagram,
): IActiveDiagramsState {
  return activeDiagramsAdapter.updateOne(
    { id: action.payload.id, changes: { linkType: action.payload.linkType } },
    state,
  );
}

function setSelectedDiagramObjectsActiveDiagramHandler(
  state: IActiveDiagramsState,
  action: fromActions.SetSelectedDiagramObjectsActiveDiagram,
): IActiveDiagramsState {
  return activeDiagramsAdapter.updateOne(
    { id: action.payload.id, changes: { selectedDiagramObjects: action.payload.selectedDiagramObjects } },
    state,
  );
}

function setSelectedSidebarTabTypeHandler(
  state: IActiveDiagramsState,
  action: fromActions.SetSelectedSidebarTabType,
): IActiveDiagramsState {
  return activeDiagramsAdapter.updateOne(
    { id: action.payload.id, changes: { selectedSidebarTabType: action.payload.selectedSidebarTabType } },
    state,
  );
}

function setDiagramImageActiveDiagramHandler(
  state: IActiveDiagramsState,
  action: fromActions.SetDiagramImageActiveDiagram,
): IActiveDiagramsState {
  return activeDiagramsAdapter.updateOne(
    { id: action.payload.id, changes: { diagramImage: action.payload.diagramImage } },
    state,
  );
}

function removeActiveDiagramHandler(
  state: IActiveDiagramsState,
  action: fromActions.RemoveActiveDiagram,
): IActiveDiagramsState {
  return activeDiagramsAdapter.removeOne(action.payload, state);
}

export const { selectAll, selectEntities } = activeDiagramsAdapter.getSelectors();

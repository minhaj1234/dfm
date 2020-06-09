import { createSelector } from '@ngrx/store';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import * as fromImplementationComponentsIcons from '../../reducers';

export const getImplementationComponentsIconsState = createSelector(
  fromImplementationComponentsIcons.getImplementationComponentsIconsStoreState,
  (state: fromImplementationComponentsIcons.DecisionFirstImplementationComponentsIconsState) => state.implementationComponentsIcons,
);

export const getImplementationComponentsIconsAsArray = createSelector(
  getImplementationComponentsIconsState,
  fromImplementationComponentsIcons.fromImplementationComponentIcons.selectAll,
);

export const getLoadedImplementationComponentsIcons = createSelector(
  getImplementationComponentsIconsState,
  fromImplementationComponentsIcons.selectEntities,
);

export const getSelectedImplementationComponentIcon = (id) => 
  createSelector(
    getImplementationComponentsIconsState,
    (implementationComponentsIconsState): ImplementationComponentIcon => implementationComponentsIconsState.entities[id],
);

export const getDisplayUploadImplementationComponentIconForm = createSelector(
  getImplementationComponentsIconsState,
  (implementationComponentsIconsState): boolean => implementationComponentsIconsState.displayUploadIconForm,
);

import { createSelector } from '@ngrx/store';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromFeature from '../../reducers';
import * as fromImplementationComponents from '../../reducers/implementation-component/implementationComponentsList.reducer';

export const getImplementationComponentsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.implementationComponents,
);

export const getLoadedImplementationComponents = createSelector(
  getImplementationComponentsState,
  fromImplementationComponents.selectEntities,
);

export const getLoadedImplementationComponentsAsArray = createSelector(
  getImplementationComponentsState,
  fromImplementationComponents.selectAll,
);

export const getImplementationComponentsAnyNetworkActive = createSelector(
  getImplementationComponentsState,
  fromImplementationComponents.selectAnyNetworkActive,
);

export const getSelectedImplementationComponent = (id) =>
  createSelector(
    getImplementationComponentsState,
    (implementationComponentState): ImplementationComponent => implementationComponentState.entities[id],
  );

export const getSelectedImplementationComponentNetworkActive = (id) =>
  createSelector(
    getImplementationComponentsState,
    (implementationComponentState): boolean => implementationComponentState.networkActive[id] || false,
  );

export const getLoadedImplementationComponentsDecisions = createSelector(
  getLoadedImplementationComponentsAsArray,
  (implementationComponents: ImplementationComponent[]) => {
    return [].concat.apply([], implementationComponents.map((implementationComponent: ImplementationComponent) => [...implementationComponent.decisions]));
  },
);

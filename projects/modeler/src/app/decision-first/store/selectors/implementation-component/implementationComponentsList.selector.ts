import { createSelector } from '@ngrx/store';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromFeature from '../../reducers';
import * as fromImplementationComponentsList from '../../reducers/implementation-component/implementationComponentsList.reducer';

export const getImplementationComponentsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.implementationComponentsList,
);

export const getImplementationComponentsList = createSelector(
  getImplementationComponentsListState,
  fromImplementationComponentsList.selectAll,
);

export const getImplementationComponentsListNetworkActive = createSelector(
  getImplementationComponentsListState,
  fromImplementationComponentsList.selectAnyNetworkActive,
);

export const getImplementationComponentsEntities = createSelector(
  getImplementationComponentsListState,
  fromImplementationComponentsList.selectEntities,
);

export const getImplementationComponentsListPagination = createSelector(
  getImplementationComponentsListState,
  fromImplementationComponentsList.getPagination,
);

export const getSelectedImplementationComponentFromImplementationComponentsList = (id) =>
  createSelector(
    getImplementationComponentsListState,
    (implementationComponentState): ImplementationComponent => implementationComponentState.entities[id],
  );
  
import { Injectable } from '@angular/core';
import { select, Action, Store } from '@ngrx/store';
import { IPagination, ISocketMessage, ObjectTabType, TechnicalTabType } from 'core/models';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import { IDecisionFirstState, StompServiceActionsMapping } from '../store';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';

@Injectable()
export class CommonStompService {
  notUpdatedEntitiesNames: string[] = [];
  actionsMapping: StompServiceActionsMapping;

  constructor(
    private store: Store<IDecisionFirstState | rootReducers.authenticationReducer.IAuthenticationState>
  ) { }

  updateSelfPageForSearchLists(): void {
    this.updateHomeSearchListSelfPage();
    this.updateMainSearchListSelfPage();
  }

  updateSelfPageObjectsList(paginationSelector: any, loadSpecificPageAction: any): void {
    this.updateList(paginationSelector, loadSpecificPageAction);
  }

  updateSelfPageDiagrammingElementsList(): void {
    this.updateSelfPageObjectsList(
      fromSelectors.getDiagrammingElementsPagination, fromActions.LoadSpecificPageForDiagrammingElementsList
    );
  }

  updateObjectTab(objectId: string, loadAction: any): void {
    this.store
    .pipe(
      select(fromSelectors.getAllTabsEntities),
      first(),
    )
    .subscribe((tabs) => {
      if (tabs[objectId]) {
        this.store.dispatch(new loadAction(objectId));
      }
    });
  }

  private updateMainSearchListSelfPage(): void {
    this.updateList(fromSelectors.getMainSearchListPagination, fromActions.LoadSpecificPageForMainSearchList);
  }

  private updateHomeSearchListSelfPage(): void {
    this.updateList(fromSelectors.getHomeSearchListPagination, fromActions.LoadSpecificPageForHomeSearchList);
  }

  private updateList(paginationSelector: any, loadSpecificPageAction: any): void {
    this.store
      .pipe(
        select(paginationSelector),
        first(),
      )
      .subscribe((pagination: IPagination) => {
        if (pagination.selfUrl) {
          this.store.dispatch(new loadSpecificPageAction(pagination.selfUrl));
        }
      });
  }

  updateRelationObjects(relatedObjectIds: string[]): void {
    this.store
    .pipe(
      select(fromSelectors.getAllTabsEntities),
      first(),
    )
    .subscribe((tabs) => {
      relatedObjectIds.forEach((id: string) => {
        if (tabs[id]) {
          this.updateObjectTab(id, this.getLoadObjectAction(ObjectTabType[tabs[id].type]));
        }
      })
    });
  }

  private getLoadObjectAction(objectTabType: ObjectTabType): Object {
    switch(objectTabType) {
      case ObjectTabType.Diagram:
        return fromActions.LoadDiagram;
      case ObjectTabType.Decision:
        return fromActions.LoadDecision;
      case ObjectTabType.InputData:
        return fromActions.LoadInputData;
      case ObjectTabType.KnowledgeSource:
        return fromActions.LoadKnowledgeSource;
      case ObjectTabType.Organization:
        return fromActions.LoadOrganization;
      case ObjectTabType.BusinessObjective:
        return fromActions.LoadBusinessObjective;
      case ObjectTabType.Process:
        return fromActions.LoadProcess;
      case ObjectTabType.Event:
        return fromActions.LoadEvent;
      case ObjectTabType.System:
        return fromActions.LoadSystem;
      case ObjectTabType.ImplementationComponent:
        return fromActions.LoadImplementationComponent;
    }
  }

  updateObjectTabHandler(socketMessage: ISocketMessage): void {
    this.store
      .pipe(
        select(rootSelectors.getAuthenticatedUserId),
        first(),
      )
      .subscribe((currentUserId) => {
        if (currentUserId !== socketMessage.userId || this.needUpdateObjectTab(socketMessage.relatedEntityType)) {
          this.updateObjectTab(socketMessage.resourceId, this.actionsMapping.loadObjectAction);
        }
      });
  }

  needUpdateObjectTab(relatedEntityType: string): boolean {
    return !this.notUpdatedEntitiesNames.some((item) => item === relatedEntityType);
  }

  updateAdminTab(relatedObjectsIds: string[], loadAction: new(id: string) => Action): void {
    combineLatest([
      this.store.pipe(select(fromSelectors.getAllTabsEntities)),
      this.store.pipe(select(rootSelectors.getAuthenticatedUser)),
    ])
    .pipe(
      first(),
    )
    .subscribe(([tabs, authenticatedUser]) => {
      const updatedObjectId = relatedObjectsIds.find((item) => item === authenticatedUser.accountId)

      if (tabs[TechnicalTabType.Admin] && updatedObjectId) {
        this.store.dispatch(new loadAction(updatedObjectId));
      }
    });
  }
}

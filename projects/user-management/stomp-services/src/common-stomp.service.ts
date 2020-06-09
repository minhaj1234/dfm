import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IPagination, ISocketMessage, ObjectTabType } from 'core/models';
import * as fromTabsStore from 'core/objects/tabs/store';
import { rootSelectors } from 'core/root-store';
import { first } from 'rxjs/operators';
import { LOAD_OBJECT_ACTION_MAPPING, StompServiceActionsMapping } from 'user-management/store/mappings';
import { IDecisionFirstState } from 'user-management/store/reducers';

@Injectable()
export class CommonStompService {
  actionsMapping: StompServiceActionsMapping;

  constructor(
    private store: Store<IDecisionFirstState>,
  ) { }

  updateSelfPageObjectsList(paginationSelector: any, loadSpecificPageAction: any) {
    this.updateList(paginationSelector, loadSpecificPageAction);
  }

  private updateObjectTab(objectId: string, loadAction: any) {
    this.store
    .pipe(
      select(fromTabsStore.getAllTabsEntities),
      first(),
    )
    .subscribe((tabs) => {
      if (tabs[objectId]) {
        this.store.dispatch(new loadAction(objectId));
      }
    });
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
      select(fromTabsStore.getAllTabsEntities),
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
    return LOAD_OBJECT_ACTION_MAPPING[objectTabType];
  }

  updateObjectTabHandler(socketMessage: ISocketMessage): void {
    this.store
      .pipe(
        select(rootSelectors.getAuthenticatedUserId),
        first(),
      )
      .subscribe((currentUserId) => {
        if (currentUserId !== socketMessage.userId || socketMessage.eventType !== 'update') {
          this.updateObjectTab(socketMessage.resourceId, this.actionsMapping.loadObjectAction);
        }
      });
  }
}

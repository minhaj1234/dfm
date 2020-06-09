import { Action } from '@ngrx/store';
import { ResourceWithId } from 'core/models';

export interface AddRelatedObjectAction extends Action {
  new (payload: {
    sourceObject: ResourceWithId;
    relatedObject: ResourceWithId;
    relationPath: string;
  }): Action;
}

export interface RemoveRelatedObjectAction extends Action {
  new (payload: {
    sourceObject: ResourceWithId;
    relatedObject: ResourceWithId;
    relationPath: string;
  }): Action;
}

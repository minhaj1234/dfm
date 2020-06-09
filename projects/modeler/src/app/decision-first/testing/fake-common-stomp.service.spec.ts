import { Action } from '@ngrx/store';

export class FakeCommonStompService {
  updateAdminTab(relatedObjectsIds: string[], loadAction: new(id: string) => Action) { }
}

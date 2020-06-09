import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { rootReducers } from 'core/root-store';
import { APP_CONFIG, MessageService } from 'core/services';
import { FakeExternalService, FakeMessageService, FakeToastrService } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Group, USER_MANAGEMENT_OBJECTS } from 'user-management/models';
import { GroupsService } from 'user-management/services';
import * as fromActions from 'user-management/store/actions';
import * as fromEffects from './groups.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Groups Effects', () => {
  let actions$: TestActions;
  let service: GroupsService;
  let effects: fromEffects.GroupsEffects;
  let toastrService: NbToastrService;
  const config = { pageSize: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, StoreModule.forRoot(rootReducers.reducers)],
      providers: [
        GroupsService,
        fromEffects.GroupsEffects,
        NbToastrService,
        { provide: APP_CONFIG, useFactory: () => config },
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: NbToastrService, useValue: new FakeToastrService() },
        { provide: MessageService, useValue: new FakeMessageService(),}
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(GroupsService);
    effects = TestBed.get(fromEffects.GroupsEffects);
    toastrService = TestBed.get(NbToastrService);

    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'create').and.returnValue(of({} as any));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'withRelatedObjects').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'createGroup').and.returnValue(of({}));
    spyOn(toastrService, 'danger');
  });

  describe('loadGroup$', () => {
    it('should dispatch LoadGroupSuccess', () => {
      const action = new fromActions.LoadGroup('12345');
      const completion = new fromActions.LoadGroupSuccess({ id: '12345' } as any);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadGroup$).toBeObservable(expected);
    });

    it('should dispatch GroupFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadGroup('12345');
      const completion = new fromActions.GroupFailure({
        id: '12345',
        error: new Error('error message'),
      });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadGroup$).toBeObservable(expected);
    });
  });

  describe('addGroup$', () => {
    it('should dispatch FinishedGenericNetworkRequestForGroup', () => {
      const action = new fromActions.AddGroup({
        group: createTestGroup(),
        accountId: 'abc'
      });
      const completion = new fromActions.FinishedGenericNetworkRequestForGroup();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addGroup$).toBeObservable(expected);
    });

    it('should dispatch GenericGroupFailure if the service throws an error', () => {
      (service.createGroup as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddGroup({
        group: createTestGroup(),
        accountId: 'abc'
      });
      const completion = new fromActions.GenericGroupFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addGroup$).toBeObservable(expected);
    });
  });

  describe('updateGroup$', () => {
    it('should dispatch FinishedNetworkRequestForGroup', () => {
      const action = new fromActions.UpdateGroup(createTestGroup());
      const completion = new fromActions.FinishedNetworkRequestForGroup('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateGroup$).toBeObservable(expected);
    });

    it('should dispatch GroupFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateGroup(createTestGroup());
      const completion = new fromActions.GroupFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateGroup$).toBeObservable(expected);
    });
  });

  describe('loadGroupAsChild$', () => {
    it('should dispatch UpdateRelatedObjectInCustomer', () => {
      const action = new fromActions.LoadGroupAsChild('12345');
      const completion = new fromActions.UpdateRelatedObjectInCustomer({ object: { id: '12345' } as Group, paths: [USER_MANAGEMENT_OBJECTS.Group.resourceName] });
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadGroupAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateRelatedObjectInGroup', () => {
      const action = new fromActions.LoadGroupAsChild('12345');
      const completion = new fromActions.UpdateRelatedObjectInUser({ object: { id: '12345' } as Group, paths: [USER_MANAGEMENT_OBJECTS.Group.resourceName] });
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadGroupAsChild$).toBeObservable(expected);
    });

    it('should dispatch GroupFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadGroupAsChild('12345');
      const completion = new fromActions.GroupFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadGroupAsChild$).toBeObservable(expected);
    });
  });

  function createTestGroup(): Group {
    const group = new Group();
    group.id = '12345';
    group.name = 'name';

    return group;
  }
});

import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ValidationSuccessResponse } from 'core/models';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { IDecisionFirstState } from '../store';
import * as fromStore from '../store';
import { FakeCommonStompService } from '../testing/fake-common-stomp.service.spec';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { CommonStompService } from './common-stomp.service';
import { ModelerUserStompService } from './modeler-user-stomp.service';

describe('Modeler User Stomp Service', () => {
  let modelerUserStompService: ModelerUserStompService;
  let dispatch: jasmine.Spy;
  let fakeAuthStompService: FakeAuthStompService;
  let store: Store<IDecisionFirstState>;
  let commonStompService: CommonStompService;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        ModelerUserStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService },
        { provide: CommonStompService, useValue: new FakeCommonStompService() },
      ],
    });

    modelerUserStompService = TestBed.get(ModelerUserStompService);
    commonStompService = TestBed.get(CommonStompService);

    spyOn(modelerUserStompService, 'updateRelationObjects');
    spyOn(commonStompService, 'updateAdminTab');

    store = TestBed.get(Store);
    store.dispatch(
      new rootActions.ValidationSuccess({
        accountId: 'customer1',
        userId: 'userId',
        userType: 'ADMIN',
      } as ValidationSuccessResponse),
    );
    dispatch = spyOn(store, 'dispatch');
  }));

  it('should be created', () => {
    expect(modelerUserStompService).toBeTruthy();
  });

  describe('create event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'user1',
        linkData: ['object1', 'object2'],
        userId: 'id',
      });
    });

    it('should update Admin tab', () => {
      expect(commonStompService.updateAdminTab).toHaveBeenCalledWith(
        ['object1', 'object2'],
        fromStore.LoadCustomer,
      );
    });

    it('should update related objects', () => {
      expect(modelerUserStompService.updateRelationObjects).toHaveBeenCalledWith(['object1', 'object2']);
    });
  });

  describe('delete event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'user1',
        linkData: ['object1', 'object2'],
        userId: 'id',
      });
    });

    it('should update Admin tab', () => {
      expect(commonStompService.updateAdminTab).toHaveBeenCalledWith(
        ['object1', 'object2'],
        fromStore.LoadCustomer,
      );
    });

    it('should update related objects', () => {
      expect(modelerUserStompService.updateRelationObjects).toHaveBeenCalledWith(['object1', 'object2']);
    });

    it('should remove tab', () => {
      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('user1'));
    });
  });
});

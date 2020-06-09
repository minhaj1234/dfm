import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TechnicalTabType, ValidationSuccessResponse } from 'core/models';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { IDecisionFirstState } from '../store';
import * as fromStore from '../store';
import { FakeCommonStompService } from '../testing/fake-common-stomp.service.spec';
import { TestStoreModule } from '../testing/test-store-module.spec';
import { CommonStompService } from './common-stomp.service';
import { ModelerGroupStompService } from './modeler-group-stomp.service';

describe('Modeler Group Stomp Service', () => {
  let modelerGroupStompService: ModelerGroupStompService;
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
        ModelerGroupStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService },
        { provide: CommonStompService, useValue: new FakeCommonStompService() },
      ],
    });

    modelerGroupStompService = TestBed.get(ModelerGroupStompService);
    commonStompService = TestBed.get(CommonStompService);

    spyOn(modelerGroupStompService, 'updateRelationObjects');
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
    expect(modelerGroupStompService).toBeTruthy();
  });

  describe('create event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'group1',
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
      expect(modelerGroupStompService.updateRelationObjects).toHaveBeenCalledWith(['object1', 'object2']);
    });
  });

  describe('delete event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'group1',
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
      expect(modelerGroupStompService.updateRelationObjects).toHaveBeenCalledWith(['object1', 'object2']);
    });

    it('should remove tab', () => {
      expect(dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('group1'));
    });
  });
});

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
import { ModelerCustomerStompService } from './modeler-customer-stomp.service';

describe('Modeler Customer Stomp Service', () => {
  let modelerCustomerStompService: ModelerCustomerStompService;
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
        ModelerCustomerStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService },
        { provide: CommonStompService, useValue: new FakeCommonStompService() },
      ],
    });

    modelerCustomerStompService = TestBed.get(ModelerCustomerStompService);
    commonStompService = TestBed.get(CommonStompService);

    spyOn(modelerCustomerStompService, 'updateObjectTabHandler');
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
    expect(modelerCustomerStompService).toBeTruthy();
  });

  describe('update event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'customer1',
        userId: 'id',
      });
    });

    it('should update Admin tab', () => {
      expect(commonStompService.updateAdminTab).toHaveBeenCalledWith(
        ['customer1'],
        fromStore.LoadCustomer,
      );
    });

    it('should update object tab', () => {
      expect(modelerCustomerStompService.updateObjectTabHandler).toHaveBeenCalledWith({
        eventType: 'update',
        resourceId: 'customer1',
        userId: 'id',
      });
    });
  });
});

import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import * as fromTabsStore from 'core/objects/tabs/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import * as fromSelectors from 'user-management/store/selectors';
import { TestStoreModule } from 'user-management/testing';
import { CustomerStompService } from './customer.stomp.service';

describe('Customer Stomp Service', () => {
  const someTimeInterval = 7200;
  let customerStompService: CustomerStompService;
  let dispatch: jasmine.Spy;
  let store: Store<IDecisionFirstState>;
  let fakeAuthStompService: FakeAuthStompService;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        CustomerStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });
    customerStompService = TestBed.get(CustomerStompService);
    spyOn(customerStompService, 'updateSelfPageObjectsList');
    spyOn(customerStompService, 'updateRelationObjects');
    spyOn(customerStompService, 'updateObjectTabHandler');

    store = TestBed.get(Store);
    store.dispatch(
      new rootActions.ValidationSuccess({
        accessToken: 'accessToken',
        accountId: 'id',
        email: 'email',
        encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
        expiresIn: 10,
        redirectToUrl: 'url',
        refreshToken: 'token',
        userId: 'id',
        expiresAt: new Date().getTime() + someTimeInterval,
        userType: 'ADMIN',
      }),
    );
    dispatch = spyOn(store, 'dispatch');
  }));

  it('should be created', () => {
    expect(customerStompService).toBeTruthy();
  });

  describe('create event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'customer1',
      });
    });
    
    it('should update object lists', () => {
      expect(customerStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromSelectors.getCustomersListPagination, 
        fromActions.LoadSpecificPageForCustomersList
      );
    });
  });

  describe('update event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'customer1',
      });
    });

    it('should update object lists', () => {
      expect(customerStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromSelectors.getCustomersListPagination, 
        fromActions.LoadSpecificPageForCustomersList
      );
    });

    it('should update object tab', () => {
      expect(customerStompService.updateObjectTabHandler).toHaveBeenCalledWith({
        eventType: 'update',
        resourceId: 'customer1',
      });
    });
  });

  describe('delete event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'customer1',
      });
    });

    it('should update object lists', () => {
      expect(customerStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromSelectors.getCustomersListPagination, 
        fromActions.LoadSpecificPageForCustomersList
      );
    });

    it('should remove tab', () => {
      expect(dispatch).toHaveBeenCalledWith(new fromTabsStore.RemoveTab('customer1'));
    });
  });
});

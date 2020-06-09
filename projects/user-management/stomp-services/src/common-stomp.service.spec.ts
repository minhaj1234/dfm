import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { IPagination, ISocketMessage, ObjectTabType } from 'core/models';
import * as fromTabsStore from 'core/objects/tabs/store';
import { rootActions } from 'core/root-store';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import * as fromSelectors from 'user-management/store/selectors';
import { TestStoreModule } from 'user-management/testing';
import { CommonStompService } from './common-stomp.service';

describe('Common Stomp Service', () => {
  const someTimeInterval = 7200;
  let commonStompService: CommonStompService;
  let dispatch: jasmine.Spy;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        CommonStompService,
      ],
    });

    commonStompService = TestBed.get(CommonStompService);
    store = TestBed.get(Store);
    store.dispatch(
      new rootActions.ValidationSuccess({
        accessToken: 'accessToken',
        accountId: 'customerId',
        email: 'email',
        encodedToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vdGVzdC10ZXN0d3cuY29tL3RlbmFudElkIjoiZGVmYXVsdCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.qVgGfthtzcQBkJrkBE8CXgkCLrfIGQe9x7BK7ZmcrRY',
        expiresIn: 10,
        redirectToUrl: 'url',
        refreshToken: 'token',
        userId: 'userId',
        expiresAt: new Date().getTime() + someTimeInterval,
        userType: 'ADMIN',
      }),
    );
    dispatch = spyOn(store, 'dispatch');
  }));

  it('should be created', () => {
    expect(commonStompService).toBeTruthy();
  });

  it('should dispatch load specific page for object list', () => {
    dispatch.and.callThrough();
    store.dispatch(new fromActions.LoadCustomersListSuccess({
      results: [], 
      pagination: getTestPagination(),
    }));

    commonStompService.updateSelfPageObjectsList(
      fromSelectors.getCustomersListPagination, 
      fromActions.LoadSpecificPageForCustomersList
    );

    expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadSpecificPageForCustomersList('https://'));
  });

  describe('updateRelationObjects', () => { 
    it('should update customer', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromTabsStore.AddTab({
        id: 'customer1',
        type: ObjectTabType.Account,
      }));
  
      commonStompService.updateRelationObjects(['customer1']);

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadCustomer('customer1'));
    });

    it('should update user', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromTabsStore.AddTab({
        id: 'user1',
        type: ObjectTabType.User,
      }));
  
      commonStompService.updateRelationObjects(['user1']);

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadUser('user1'));
    });

    it('should update group', () => {
      dispatch.and.callThrough();
      store.dispatch(new fromTabsStore.AddTab({
        id: 'group1',
        type: ObjectTabType.Group,
      }));
  
      commonStompService.updateRelationObjects(['group1']);

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadGroup('group1'));
    });
  });

  describe('updateObjectTabHandler', () => {
    beforeEach(() => {
      dispatch.and.callThrough();
      store.dispatch(new fromTabsStore.AddTab({
        id: 'customer1',
        type: ObjectTabType.Account,
      }));
      commonStompService.actionsMapping = { loadObjectAction: fromActions.LoadCustomer };
    });

    it('should dispatch load object action if user id is not equal with current user id', () => {
      commonStompService.updateObjectTabHandler({userId: 'differentUserId', resourceId: 'customer1'} as ISocketMessage);

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadCustomer('customer1'));
    });

    it('should dispatch load object action if event type is not update', () => {
      commonStompService.updateObjectTabHandler({userId: 'userId', resourceId: 'customer1', eventType: 'linkUpdate'} as ISocketMessage);

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadCustomer('customer1'));
    });

    it('should not dispatch load object action', () => {
      commonStompService.updateObjectTabHandler({userId: 'userId', resourceId: 'customer1', eventType: 'update'} as ISocketMessage);

      expect(dispatch).not.toHaveBeenCalledWith(new fromActions.LoadCustomer('customer1'));
    });
  })
  
  function getTestPagination(): IPagination {
    return {
      selfUrl: 'https://',
      number: 0,
      size: 0,
      totalElements: 0,
      totalPages: 0,
    }
  }
});

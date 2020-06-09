import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import * as fromTabsStore from 'core/objects/tabs/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Customer, Group, User } from 'user-management/models';
import { UserStompService } from 'user-management/stomp-services';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { TestStoreModule } from 'user-management/testing';

describe('User Stomp Service', () => {
  const someTimeInterval = 7200;
  let userStompService: UserStompService;
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
        UserStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });
    userStompService = TestBed.get(UserStompService);
    spyOn(userStompService, 'updateSelfPageObjectsList');
    spyOn(userStompService, 'updateRelationObjects');
    spyOn(userStompService, 'updateObjectTabHandler');

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
    expect(userStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update object lists', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'user1',
        linkData: ['customer1', 'group1'],
      });

      expect(userStompService.updateRelationObjects).toHaveBeenCalledWith(['customer1', 'group1']);
    });
  });

  describe('update event', () => {
    it('should update object lists and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'user1',
      });

      expect(userStompService.updateObjectTabHandler).toHaveBeenCalledWith({
        eventType: 'update',
        resourceId: 'user1',
      });
    });

    it('should update user in customer', () => {
      const user = new User();
      user.id = 'user1';
      const customer = new Customer();
      customer.id = 'customer1';
      customer.users = [user];
      dispatch.and.callThrough();
      store.dispatch(new fromActions.LoadCustomerSuccess(customer));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'user1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadUserAsChild('user1'));
    });

    it('should update user in group', () => {
      const user = new User();
      user.id = 'user1';
      const group = new Group();
      group.id = 'group1';
      group.users = [user];
      dispatch.and.callThrough();
      store.dispatch(new fromActions.LoadGroupSuccess(group));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'user1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadUserAsChild('user1'));
    });
  });

  describe('delete event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'user1',
        linkData: ['customer1', 'group1'],
      });
    });

    it('should update object lists', () => {
      expect(userStompService.updateRelationObjects).toHaveBeenCalledWith(['customer1', 'group1']);
    });

    it('should remove tab', () => {
      expect(dispatch).toHaveBeenCalledWith(new fromTabsStore.RemoveTab('user1'));
    });
  });
});

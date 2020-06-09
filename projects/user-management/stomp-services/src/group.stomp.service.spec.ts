import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromTabsStore from 'core/objects/tabs/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { Customer, Group, User } from 'user-management/models';
import * as fromActions from 'user-management/store/actions';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { TestStoreModule } from 'user-management/testing';
import { GroupStompService } from './group.stomp.service';

describe('Group Stomp Service', () => {
  const someTimeInterval = 7200;
  let groupStompService: GroupStompService;
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
        GroupStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });
    groupStompService = TestBed.get(GroupStompService);
    spyOn(groupStompService, 'updateSelfPageObjectsList');
    spyOn(groupStompService, 'updateRelationObjects');
    spyOn(groupStompService, 'updateObjectTabHandler');

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
    expect(groupStompService).toBeTruthy();
  });

  describe('create event', () => {
    it('should update object lists', () => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'group1',
        linkData: ['customer1', 'user1'],
      });

      expect(groupStompService.updateRelationObjects).toHaveBeenCalledWith(['customer1', 'user1']);
    });
  });

  describe('update event', () => {
    it('should update object lists and object tab', () => {
      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'group1',
      });

      expect(groupStompService.updateObjectTabHandler).toHaveBeenCalledWith({
        eventType: 'update',
        resourceId: 'group1',
      });
    });

    it('should update group in customer', () => {
      const group = new Group();
      group.id = 'group1';
      const customer = new Customer();
      customer.id = 'customer1';
      customer.groups = [group];
      dispatch.and.callThrough();
      store.dispatch(new fromActions.LoadCustomerSuccess(customer));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'group1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadGroupAsChild('group1'));
    });

    it('should update group in customer', () => {
      const group = new Group();
      group.id = 'group1';
      const user = new User();
      user.id = 'customer1';
      user.groups = [group];
      dispatch.and.callThrough();
      store.dispatch(new fromActions.LoadUserSuccess(user));

      fakeAuthStompService._next({
        eventType: 'update',
        resourceId: 'group1',
      });

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadGroupAsChild('group1'));
    });
  });

  describe('delete event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'group1',
        linkData: ['customer1', 'user1'],
      });
    });

    it('should update object lists', () => {
      expect(groupStompService.updateRelationObjects).toHaveBeenCalledWith(['customer1', 'user1']);
    });

    it('should remove tab', () => {
      expect(dispatch).toHaveBeenCalledWith(new fromTabsStore.RemoveTab('group1'));
    });
  });
});

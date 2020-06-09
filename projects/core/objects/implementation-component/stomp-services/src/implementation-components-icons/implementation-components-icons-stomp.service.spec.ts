import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ValidationSuccessResponse } from 'core/models';
import { ImplementationComponentIconsStompService } from 'core/objects/implementation-component/stomp-services';
import * as fromStore from 'core/objects/implementation-component/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService, TestStoreModule } from 'core/testing';

describe('Implementation Component Icons Stomp Service', () => {
  let implementationComponentIconsStompService: ImplementationComponentIconsStompService;
  let dispatch: jasmine.Spy;
  let store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>;
  let fakeAuthStompService: FakeAuthStompService;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule
      ],
      providers: [
        ImplementationComponentIconsStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });
    implementationComponentIconsStompService = TestBed.get(ImplementationComponentIconsStompService);

    store = TestBed.get(Store);
    store.dispatch(
      new rootActions.ValidationSuccess({
        accountId: 'id',
        userId: 'id',
        userType: 'ADMIN',
      } as ValidationSuccessResponse),
    );
    dispatch = spyOn(store, 'dispatch');
  }));

  it('should be created', () => {
    expect(implementationComponentIconsStompService).toBeTruthy();
  });

  describe('create event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'create',
        resourceId: 'icon1',
      });
    });
    
    it('should load icon', () => {
     expect(dispatch).toHaveBeenCalledWith(new fromStore.LoadImplementationComponentsIcon('icon1'));
    });
  });

  describe('delete event', () => {
    beforeEach(() => {
      fakeAuthStompService._next({
        eventType: 'delete',
        resourceId: 'icon1',
      });
    });
    
    it('should load icons', () => {
     expect(dispatch).toHaveBeenCalledWith(new fromStore.RemovelementationComponentIconFromLocalMemory('icon1'));
    });
  });
});

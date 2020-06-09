import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { AuthStompService } from 'core/stomp-services';
import { FakeAuthStompService } from 'core/testing';
import { TagStompService } from '.';
import * as fromStore from '../store';
import { IDecisionFirstState } from '../store';
import * as fromActions from '../store/actions';
import { TestStoreModule } from '../testing/test-store-module.spec';

describe('Tag Stomp Service', () => {
  const someTimeInterval = 7200;
  let tagStompService: TagStompService;
  let dispatch: jasmine.Spy;
  let fakeAuthStompService: FakeAuthStompService;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    fakeAuthStompService = new FakeAuthStompService();
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        TagStompService,
        { provide: AuthStompService, useValue: fakeAuthStompService }
      ],
    });

    tagStompService = TestBed.get(TagStompService);
    spyOn(tagStompService, 'updateSelfPageForSearchLists');
    spyOn(tagStompService, 'updateSelfPageObjectsList');
    spyOn(tagStompService, 'updateObjectTab');
    spyOn(tagStompService, 'updateRelationObjects');
    spyOn(tagStompService, 'updateChildObjectsForDiagram');

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
    expect(tagStompService).toBeTruthy();
  });

  describe('link update event', () => {
    it('should update object tab, relation objects and search lists', () => {
      fakeAuthStompService._next({
        eventType: 'linkUpdate',
        resourceId: 'tag1',
        linkData: ['123,321']
      });

      expect(tagStompService.updateObjectTab).toHaveBeenCalledWith('tag1', fromStore.LoadTag);
      expect(tagStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
      expect(tagStompService.updateChildObjectsForDiagram).toHaveBeenCalledWith(['123,321']);
      expect(tagStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getTagsListPagination, 
        fromStore.LoadSpecificPageForTagsList
      );
    });
  });

  describe('link delete event', () => {
    it('should update object tab and relation objects', () => {
      fakeAuthStompService._next({
        eventType: 'linkDelete',
        resourceId: 'tag1',
        linkData: ['123,321']
      });

      expect(dispatch).toHaveBeenCalledWith(new fromActions.RemoveTab('tag1'));
      expect(tagStompService.updateRelationObjects).toHaveBeenCalledWith(['123,321']);
      expect(tagStompService.updateChildObjectsForDiagram).toHaveBeenCalledWith(['123,321']);
      expect(tagStompService.updateSelfPageObjectsList).toHaveBeenCalledWith(
        fromStore.getTagsListPagination, 
        fromStore.LoadSpecificPageForTagsList
      );
    });
  });
});

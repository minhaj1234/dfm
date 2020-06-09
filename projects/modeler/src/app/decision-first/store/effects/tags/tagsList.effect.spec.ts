import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Tag } from '../../../models/tag.model';
import { TagsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions/tags/tagsList.actions';
import * as fromEffects from './tagsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const tags: Tag[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Systems List Effects', () => {
  let actions$: TestActions;
  let service: TagsService;
  let effects: fromEffects.TagsListEffects;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        TagsService,
        fromEffects.TagsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(TagsService);
    effects = TestBed.get(fromEffects.TagsListEffects);
    messageService = TestBed.get(MessageService);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: tags, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: tags, pagination: blankPages }));

    spyOn(messageService, 'handleError');
  });

  describe('loadTagsList$', () => {
    it('should dispatch LoadTagsListSuccess', () => {
      const action = new fromActions.LoadTagsList();
      const completion = new fromActions.LoadTagsListSuccess({
        results: tags,
        pagination: blankPages,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadTagsList$).toBeObservable(expected);
    });

    it('should dispatch TagsListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadTagsList();
      const completion = new fromActions.TagsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadTagsList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForTagsList$', () => {
    it('should dispatch LoadTagsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForTagsList('https://example.com/3432');
      const completion = new fromActions.LoadTagsListSuccess({
        results: tags,
        pagination: blankPages,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForTagsList$).toBeObservable(expected);
    });

    it('should dispatch TagsListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForTagsList('https://example.com/757');
      const completion = new fromActions.TagsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForTagsList$).toBeObservable(expected);
    });
  });

  describe('tagsListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.TagsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.tagsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.tagsList');
    });
  });
});

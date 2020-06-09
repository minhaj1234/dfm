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
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { KnowledgeSourceService } from '../../../services';
import * as fromActions from '../../actions';
import * as fromEffects from './knowledgeSourceList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const knowledgeSources: KnowledgeSource[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Knowledge Sources List Effects', () => {
  let actions$: TestActions;
  let service: KnowledgeSourceService;
  let effects: fromEffects.KnowledgeSourceListEffects;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule],
      providers: [
        KnowledgeSourceService,
        fromEffects.KnowledgeSourceListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(KnowledgeSourceService);
    effects = TestBed.get(fromEffects.KnowledgeSourceListEffects);
    messageService = TestBed.get(MessageService);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: knowledgeSources, pagination: blankPages }));
    spyOn(service, 'getSingleMinimal').and.returnValue(of(knowledgeSources[0]));
    spyOn(service, 'getSingleEdit').and.returnValue(of(knowledgeSources[0]));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: knowledgeSources, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('loadKnowledgeSourceList$', () => {
    it('should dispatch LoadKnowledgeSourcesListSuccess', () => {
      const action = new fromActions.LoadKnowledgeSourcesList();
      const completion = new fromActions.LoadKnowledgeSourcesListSuccess({
        pagination: blankPages,
        results: knowledgeSources,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadKnowledgeSourceList$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourcesListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadKnowledgeSourcesList();
      const completion = new fromActions.KnowledgeSourcesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadKnowledgeSourceList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForKnowledgeSourcesList$', () => {
    it('should dispatch LoadKnowledgeSourcesListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForKnowledgeSourcesList('https://example.com/43553');
      const completion = new fromActions.LoadKnowledgeSourcesListSuccess({
        pagination: blankPages,
        results: knowledgeSources,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForKnowledgeSourcesList$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourcesListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForKnowledgeSourcesList('https://example.com/9767456');
      const completion = new fromActions.KnowledgeSourcesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForKnowledgeSourcesList$).toBeObservable(expected);
    });
  });

  describe('loadSingleDecisionForDecisionList$', () => {
    it('should dispatch LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess', () => {
      const action = new fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList('decision1');
      const completion = new fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess(knowledgeSources[0]);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completion, c: jasmine.anything() });

      expect(effects.loadSingleKnowledgeSourceForKnowledgeSourcesList$).toBeObservable(expected);
    });

    it('should dispatch LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess', () => {
      const action = new fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList('decision1');
      const completion = new fromActions.UpdateSingleDiagrammingElementIfNeeded(knowledgeSources[0]);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: jasmine.anything(), c: completion });

      expect(effects.loadSingleKnowledgeSourceForKnowledgeSourcesList$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList('decision1');
      const completion = new fromActions.KnowledgeSourcesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSingleKnowledgeSourceForKnowledgeSourcesList$).toBeObservable(expected);
    });
  });

  describe('knowledgeSourcesListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.KnowledgeSourcesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.knowledgeSourcesListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.knowledgeSourcesList',
      );
    });
  });

  describe('updateSearchForKnowledgeSourcesList$', () => {
    it('should dispatch LoadKnowledgeSourcesListSuccess', () => {
      const action = new fromActions.UpdateSearchForKnowledgeSourcesList();
      const completion = new fromActions.LoadKnowledgeSourcesListSuccess({
        pagination: blankPages,
        results: knowledgeSources,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForKnowledgeSourcesList$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourcesListFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.UpdateSearchForKnowledgeSourcesList();
      const completion = new fromActions.KnowledgeSourcesListFailure(error);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForKnowledgeSourcesList$).toBeObservable(expected);
    });
  });

  describe('updateSearchForKnowledgeSourcesList$', () => {
    it('should dispatch LoadKnowledgeSourcesListSuccess', () => {
      const action = new fromActions.UpdateSearchForKnowledgeSourcesList();
      const completion = new fromActions.LoadKnowledgeSourcesListSuccess({
        pagination: blankPages,
        results: knowledgeSources,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForKnowledgeSourcesList$).toBeObservable(expected);
    });

    it('should dispatch KnowledgeSourcesListFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.UpdateSearchForKnowledgeSourcesList();
      const completion = new fromActions.KnowledgeSourcesListFailure(error);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForKnowledgeSourcesList$).toBeObservable(expected);
    });
  });
});

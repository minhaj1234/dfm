import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Decision } from '../../../models/decision.model';
import { DecisionsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromDecisionsListActions from '../../actions/decision/decisionsList.actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './decisionsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const decisions: Decision[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Decisions List Effects', () => {
  let actions$: TestActions;
  let service: DecisionsService;
  let effects: fromEffects.DecisionsListEffects;
  let messageService: MessageService;
  let store: Store<IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        DecisionsService,
        fromEffects.DecisionsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(DecisionsService);
    effects = TestBed.get(fromEffects.DecisionsListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: decisions, pagination: blankPages }));
    spyOn(service, 'getSingleMinimal').and.returnValue(of(decisions[0]));
    spyOn(service, 'getSingleEdit').and.returnValue(of(decisions[0]));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: decisions, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('loadDecisionsList$', () => {
    it('should dispatch LoadDecisionListSuccess', () => {
      const action = new fromActions.LoadDecisionsList();
      const completion = new fromDecisionsListActions.LoadDecisionsListSuccess({
        pagination: blankPages,
        results: decisions,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadDecisionsList$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadDecisionsList();
      const completion = new fromActions.DecisionsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadDecisionsList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForDecisionsList$', () => {
    it('should dispatch LoadDecisionsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForDecisionsList('https://example.com/45645');
      const completion = new fromActions.LoadDecisionsListSuccess({
        pagination: blankPages,
        results: decisions,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForDecisionsList$).toBeObservable(expected);
    });

    it('should dispatch DecisionsListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForDecisionsList('https://example.com/4564564');
      const completion = new fromActions.DecisionsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForDecisionsList$).toBeObservable(expected);
    });
  });

  describe('updateSearchForDecisions$', () => {
    it('should dispatch LoadDecisionListSuccess', () => {
      const action = new fromActions.UpdateSearchForDecisionsList();
      const completion = new fromDecisionsListActions.LoadDecisionsListSuccess({
        pagination: blankPages,
        results: decisions,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForDecisionsList$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.UpdateSearchForDecisionsList();
      const completion = new fromActions.DecisionsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForDecisionsList$).toBeObservable(expected);
    });
  });

  describe('loadSingleDecisionForDecisionList$', () => {
    it('should dispatch LoadSingleDecisionForDecisionsListSuccess', () => {
      const action = new fromActions.LoadSingleDecisionForDecisionsList('decision1');
      const completion = new fromDecisionsListActions.LoadSingleDecisionForDecisionsListSuccess(decisions[0]);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: completion, c: jasmine.anything() });

      expect(effects.loadSingleDecisionForDecisionsList$).toBeObservable(expected);
    });

    it('should dispatch LoadSingleDecisionForDecisionsListSuccess', () => {
      const action = new fromActions.LoadSingleDecisionForDecisionsList('decision1');
      const completion = new fromActions.UpdateSingleDiagrammingElementIfNeeded(decisions[0]);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-(bc)', { b: jasmine.anything(), c: completion });

      expect(effects.loadSingleDecisionForDecisionsList$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSingleDecisionForDecisionsList('decision1');
      const completion = new fromActions.DecisionsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSingleDecisionForDecisionsList$).toBeObservable(expected);
    });
  });

  describe('decisionsListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.DecisionsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.decisionsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.decisionsList');
    });
  });
});

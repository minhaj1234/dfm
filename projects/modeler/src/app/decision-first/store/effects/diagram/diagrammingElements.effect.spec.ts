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
import { DiagrammingElementsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './diagrammingElements.effect';

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

describe('Diagramming Elements Effects', () => {
  let actions$: TestActions;
  let service: DiagrammingElementsService;
  let effects: fromEffects.DiagrammingElementsEffects;
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
        DiagrammingElementsService,
        fromEffects.DiagrammingElementsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(DiagrammingElementsService);
    effects = TestBed.get(fromEffects.DiagrammingElementsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: decisions, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: decisions, pagination: blankPages }));
    spyOn(service, 'getMissingForNode').and.returnValue(of({ results: decisions, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('updateSearchForDiagrammingElements$', () => {
    it('should dispatch LoadDiagrammingElementsListSuccess', () => {
      const action = new fromActions.UpdateSearchForDiagrammingElements({ searchTerm: '' });
      const completion = new fromActions.LoadDiagrammingElementsListSuccess({
        pagination: blankPages,
        results: decisions,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForDiagrammingElements$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateSearchForDiagrammingElements({ searchTerm: '' });
      const completion = new fromActions.LoadDiagrammingElementsListFail(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForDiagrammingElements$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForDiagrammingElementsList$', () => {
    it('should dispatch LoadDiagrammingElementsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForDiagrammingElementsList('https://example.com/234534');
      const completion = new fromActions.LoadDiagrammingElementsListSuccess({
        pagination: blankPages,
        results: decisions,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForDiagrammingElementsList$).toBeObservable(expected);
    });

    it('should dispatch LoadDiagrammingElementsListFail if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForDiagrammingElementsList('https://example.com/64576');
      const completion = new fromActions.LoadDiagrammingElementsListFail(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForDiagrammingElementsList$).toBeObservable(expected);
    });
  });

  describe('loadMissingDiagrammingElementsForNode$', () => {
    it('should dispatch LoadDiagrammingElementsListSuccess', () => {
      const action = new fromActions.LoadMissingDiagrammingElementsForNode({diagramId: 'diagram1', nodeId: 'node1'});
      const completion = new fromActions.LoadDiagrammingElementsListSuccess({
        pagination: blankPages,
        results: decisions,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadMissingDiagrammingElementsForNode$).toBeObservable(expected);
    });

    it('should dispatch LoadDiagrammingElementsListFail if the service throws an error', () => {
      (service.getMissingForNode as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadMissingDiagrammingElementsForNode({diagramId: 'diagram1', nodeId: 'node1'});
      const completion = new fromActions.LoadDiagrammingElementsListFail(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadMissingDiagrammingElementsForNode$).toBeObservable(expected);
    });
  });

  describe('decisionFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.LoadDiagrammingElementsListFail(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.diagrammingElementsFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.diagrammingElements',
      );
    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { MessageService } from 'core/services';
import { FakeMessageService } from 'core/testing';
import { FakeExternalService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Diagram } from '../../../models/diagram.model';
import { DiagramsService } from '../../../services';
import * as fromActions from '../../actions/diagram/diagramsList.actions';
import * as fromDecisionsListActions from '../../actions/diagram/diagramsList.actions';
import * as fromEffects from './diagramsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const diagrams: Diagram[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Diagrams List Effects', () => {
  let actions$: TestActions;
  let service: DiagramsService;
  let effects: fromEffects.DiagramsListEffects;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule],
      providers: [
        DiagramsService,
        fromEffects.DiagramsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(DiagramsService);
    effects = TestBed.get(fromEffects.DiagramsListEffects);
    messageService = TestBed.get(MessageService);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: diagrams, pagination: blankPages }));
    spyOn(service, 'getSingleMinimal').and.returnValue(of(diagrams[0]));
    spyOn(service, 'get').and.returnValue(of(diagrams[0]));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: diagrams, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('loadDiagramsList$', () => {
    it('should dispatch LoadDecisionListSuccess', () => {
      const action = new fromActions.LoadDiagramsList();
      const completion = new fromDecisionsListActions.LoadDiagramsListSuccess({
        pagination: blankPages,
        results: diagrams,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadDiagramsList$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadDiagramsList();
      const completion = new fromActions.DiagramsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadDiagramsList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForDiagramsList$', () => {
    it('should dispatch LoadDiagramsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForDiagramsList('https://example.com/23443534');
      const completion = new fromActions.LoadDiagramsListSuccess({
        pagination: blankPages,
        results: diagrams,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForDiagramsList$).toBeObservable(expected);
    });

    it('should dispatch DiagramsListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForDiagramsList('https://example.com/303');
      const completion = new fromActions.DiagramsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForDiagramsList$).toBeObservable(expected);
    });
  });

  describe('loadSingleDiagramForDiagramsList$', () => {
    it('should dispatch LoadSingleDiagramForDiagramsListSuccess', () => {
      const action = new fromActions.LoadSingleDiagramForDiagramsList('diagram1');
      const completion = new fromDecisionsListActions.LoadSingleDiagramForDiagramsListSuccess(diagrams[0]);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSingleDiagramForDiagramsList$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadSingleDiagramForDiagramsList('diagram1');
      const completion = new fromActions.DiagramsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSingleDiagramForDiagramsList$).toBeObservable(expected);
    });
  });

  describe('diagramsListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.DiagramsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.diagramsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.diagramsList');
    });
  });

  describe('updateSearchForDiagramsList$', () => {
    it('should dispatch LoadDiagramsListSuccess', () => {
      const action = new fromActions.UpdateSearchForDiagramsList('diagram1');
      const completion = new fromDecisionsListActions.LoadDiagramsListSuccess({
        pagination: blankPages,
        results: diagrams,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForDiagramsList$).toBeObservable(expected);
    });

    it('should dispatch DiagramsListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateSearchForDiagramsList('diagram1');
      const completion = new fromActions.DiagramsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateSearchForDiagramsList$).toBeObservable(expected);
    });
  });
});

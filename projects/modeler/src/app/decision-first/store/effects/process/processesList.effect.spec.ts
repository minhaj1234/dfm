import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { rootReducers } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Process } from '../../../models/process.model';
import { ProcessesService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromProcessesListActions from '../../actions/process/processesList.actions';
import * as fromReducers from '../../reducers';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './processesList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const processes: Process[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Process List Effects', () => {
  let actions$: TestActions;
  let service: ProcessesService;
  let effects: fromEffects.ProcessesListEffects;
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
        ProcessesService,
        fromEffects.ProcessesListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(ProcessesService);
    effects = TestBed.get(fromEffects.ProcessesListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: processes, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: processes, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('loadProcessesList$', () => {
    it('should dispatch LoadProcessesListSuccess', () => {
      const action = new fromActions.LoadProcessesList();
      const completion = new fromProcessesListActions.LoadProcessesListSuccess({
        pagination: blankPages,
        results: processes,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadProcessesList$).toBeObservable(expected);
    });

    it('should dispatch ProcessesListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadProcessesList();
      const completion = new fromActions.ProcessesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadProcessesList$).toBeObservable(expected);
    });
  });

  describe('LoadSpecificPageForProcessesList$', () => {
    it('should dispatch LoadProcessesListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForProcessesList('https://example.com/2312');
      const completion = new fromActions.LoadProcessesListSuccess({
        pagination: blankPages,
        results: processes,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForProcessesList$).toBeObservable(expected);
    });

    it('should dispatch ProcessesListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForProcessesList('https://example.com/64565');
      const completion = new fromActions.ProcessesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForProcessesList$).toBeObservable(expected);
    });
  });

  describe('processesListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.ProcessesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.processesListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.processesList');
    });
  });
});

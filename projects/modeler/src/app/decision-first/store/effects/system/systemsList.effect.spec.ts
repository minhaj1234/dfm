import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { System } from '../../../models/system.model';
import { SystemsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromSystemsListActions from '../../actions/system/systemsList.action';
import * as fromReducers from '../../reducers';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './systemsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const systems: System[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('Systems List Effects', () => {
  let actions$: TestActions;
  let service: SystemsService;
  let effects: fromEffects.SystemsListEffects;
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
        SystemsService,
        fromEffects.SystemsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(SystemsService);
    effects = TestBed.get(fromEffects.SystemsListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: systems, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: systems, pagination: blankPages }));

    spyOn(messageService, 'handleError');
  });

  describe('loadSystemsList$', () => {
    it('should dispatch LoadSystemsListSuccess', () => {
      const action = new fromActions.LoadSystemsList();
      const completion = new fromSystemsListActions.LoadSystemsListSuccess({
        pagination: blankPages,
        results: systems,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSystemsList$).toBeObservable(expected);
    });

    it('should dispatch SystemsListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSystemsList();
      const completion = new fromActions.SystemsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSystemsList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForSystemsList$', () => {
    it('should dispatch LoadSystemsListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForSystemsList('https://example.com/23423');
      const completion = new fromActions.LoadSystemsListSuccess({
        pagination: blankPages,
        results: systems,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForSystemsList$).toBeObservable(expected);
    });

    it('should dispatch SystemsListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForSystemsList('https://example.com/23518');
      const completion = new fromActions.SystemsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForSystemsList$).toBeObservable(expected);
    });
  });

  describe('systemsListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.SystemsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.systemsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.systemsList');
    });
  });
});

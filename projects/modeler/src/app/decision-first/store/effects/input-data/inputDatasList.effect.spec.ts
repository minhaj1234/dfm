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
import { InputData } from '../../../models/inputData.model';
import { InputDatasService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromInputDatasActions from '../../actions/input-data/inputDatasList.actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './inputDatasList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const inputDatas: InputData[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('InputDatas List Effects', () => {
  let actions$: TestActions;
  let service: InputDatasService;
  let effects: fromEffects.InputDatasListEffects;
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
        InputDatasService,
        fromEffects.InputDatasListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(InputDatasService);
    effects = TestBed.get(fromEffects.InputDatasListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: inputDatas, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: inputDatas, pagination: blankPages }));
    
    spyOn(messageService, 'handleError');
  });

  describe('loadInputDatasList$', () => {
    it('should dispatch LoadInputDataSuccess', () => {
      const action = new fromActions.LoadInputDatasList();
      const completion = new fromInputDatasActions.LoadInputDatasListSuccess({
        pagination: blankPages,
        results: inputDatas,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadInputDatasList$).toBeObservable(expected);
    });

    it('should dispatch InputDatasListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadInputDatasList();
      const completion = new fromActions.InputDatasListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadInputDatasList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForInputDataList$', () => {
    it('should dispatch LoadInputDatasListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForInputDataList('https://example.com/546');
      const completion = new fromActions.LoadInputDatasListSuccess({
        pagination: blankPages,
        results: inputDatas,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForInputDataList$).toBeObservable(expected);
    });

    it('should dispatch InputDatasListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForInputDataList('https://example.com/1243345');
      const completion = new fromActions.InputDatasListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForInputDataList$).toBeObservable(expected);
    });
  });

  describe('inputDatasListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.InputDatasListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.inputDatasListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.inputDataList',
      );
    });
  });
});

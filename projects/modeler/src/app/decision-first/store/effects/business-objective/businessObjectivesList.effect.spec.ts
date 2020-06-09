import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { MessageService } from 'core/services';
import { FakeMessageService } from 'core/testing'
import { FakeExternalService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { BusinessObjectivesService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromBusinessObjectivesListActions from '../../actions/business-objective/businessObjectivesList.actions';
import * as fromReducers from '../../reducers';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './businessObjectivesList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const businessObjectives: BusinessObjective[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('BusinessObjective List Effects', () => {
  let actions$: TestActions;
  let service: BusinessObjectivesService;
  let effects: fromEffects.BusinessObjectivesListEffects;
  let store: Store<IDecisionFirstState>;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        BusinessObjectivesService,
        fromEffects.BusinessObjectivesListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(BusinessObjectivesService);
    effects = TestBed.get(fromEffects.BusinessObjectivesListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getByUrl').and.returnValue(of({ results: businessObjectives, pagination: blankPages }));
    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(
      of({ results: businessObjectives, pagination: blankPages }),
    );
    spyOn(messageService, 'handleError');
  });

  describe('loadBusinessObjectivesList$', () => {
    it('should dispatch LoadBusinessObjectivesListSuccess', () => {
      const action = new fromActions.LoadBusinessObjectivesList();
      const completion = new fromBusinessObjectivesListActions.LoadBusinessObjectivesListSuccess({
        pagination: blankPages,
        results: businessObjectives,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadBusinessObjectivesList$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectivesListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadBusinessObjectivesList();
      const completion = new fromActions.BusinessObjectivesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadBusinessObjectivesList$).toBeObservable(expected);
    });
  });

  describe('loadSpecificPageForBusinessObjectivesList$', () => {
    it('should dispatch LoadBusinessObjectivesListSuccess', () => {
      const action = new fromActions.LoadSpecificPageForBusinessObjectivesList('https://example.com/35345');
      const completion = new fromBusinessObjectivesListActions.LoadBusinessObjectivesListSuccess({
        pagination: blankPages,
        results: businessObjectives,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForBusinessObjectivesList$).toBeObservable(expected);
    });

    it('should dispatch BusinessObjectivesListFailure if the service throws an error', () => {
      (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadSpecificPageForBusinessObjectivesList('https://example.com/4564564');
      const completion = new fromActions.BusinessObjectivesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadSpecificPageForBusinessObjectivesList$).toBeObservable(expected);
    });
  });

  describe('businessObjectivesListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.BusinessObjectivesListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.businessObjectivesListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.businessObjectivesList',
      );
    });
  });
});

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
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { ImplementationComponentsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromImplementationComponentsListActions from '../../actions/implementation-component/implementationComponentsList.action';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './implementationComponentsList.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

const implementationComponents: ImplementationComponent[] = [{} as any, {} as any];

export function getActions() {
  return new TestActions();
}

describe('ImplementationComponents List Effects', () => {
  let actions$: TestActions;
  let service: ImplementationComponentsService;
  let effects: fromEffects.ImplementationComponentsListEffects;
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
        ImplementationComponentsService,
        fromEffects.ImplementationComponentsListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(ImplementationComponentsService);
    effects = TestBed.get(fromEffects.ImplementationComponentsListEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({ results: implementationComponents, pagination: blankPages }));
    spyOn(service, 'getByUrl').and.returnValue(of({ results: implementationComponents, pagination: blankPages }));
    spyOn(messageService, 'handleError');
  });

  describe('loadImplementationComponentsList$', () => {
    it('should dispatch LoadImplementationComponentsListSuccess', () => {
      const action = new fromActions.LoadImplementationComponentsList();
      const completion = new fromImplementationComponentsListActions.LoadImplementationComponentsListSuccess({
        pagination: blankPages,
        results: implementationComponents,
      });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadImplementationComponentsList$).toBeObservable(expected);
    });

    describe('loadSpecificPageForImplementationComponentsList$', () => {
      it('should dispatch LoadImplementationComponentsListSuccess', () => {
        const action = new fromActions.LoadSpecificPageForImplementationComponentsList('https://example.com/23567522');
        const completion = new fromActions.LoadImplementationComponentsListSuccess({
          pagination: blankPages,
          results: implementationComponents,
        });
  
        actions$.stream = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
  
        expect(effects.loadSpecificPageForImplementationComponentsList$).toBeObservable(expected);
      });
  
      it('should dispatch ImplementationComponentsListFailure if the service throws an error', () => {
        (service.getByUrl as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
        const action = new fromActions.LoadSpecificPageForImplementationComponentsList('https://example.com/345333');
        const completion = new fromActions.ImplementationComponentsListFailure(new Error('error message'));
  
        actions$.stream = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });
  
        expect(effects.loadSpecificPageForImplementationComponentsList$).toBeObservable(expected);
      });
    });

    it('should dispatch ImplementationComponentsListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromActions.LoadImplementationComponentsList();
      const completion = new fromActions.ImplementationComponentsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadImplementationComponentsList$).toBeObservable(expected);
    });
  });

  describe('implementationComponentsListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.ImplementationComponentsListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.implementationComponentsListFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.implementationComponentsList',
      );
    });
  });
});

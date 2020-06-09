import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { InputData } from '../../../models/inputData.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Organization } from '../../../models/organization.model';
import { InputDatasService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import * as fromActions from '../../actions';
import { AddTab } from '../../actions';
import * as fromEffects from './inputData.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('InputData Effects', () => {
  let actions$: TestActions;
  let service: InputDatasService;
  let effects: fromEffects.InputDatasEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        InputDatasService,
        fromEffects.InputDatasEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(InputDatasService);
    effects = TestBed.get(fromEffects.InputDatasEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.InputData,
    }));

    spyOn(service, 'getSingleMinimal').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleObjectForDiagram').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));
    spyOn(service, 'create').and.returnValue(of({id: '12345'} as any));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'addRelatedObject').and.returnValue(of({}));
    spyOn(service, 'removeRelatedObject').and.returnValue(of({}));
    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showWarning');
  });

  describe('loadInputData$', () => {
    it('should dispatch LoadInputDataSuccess', () => {
      const action = new fromActions.LoadInputData('12345');
      const completion = new fromActions.LoadInputDataSuccess({ id: '12345' } as any);
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputData$).toBeObservable(expected);
    });

    it('should dispatch UpdateDiagramGraphableObject for update InputDatas', () => {
      const action = new fromActions.LoadInputData('12345');
      const completion = new fromActions.UpdateDiagramGraphableObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.InputDatas]});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.loadInputData$).toBeObservable(expected);
    });

    it('should dispatch InputDataFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadInputData('12345');
      const completion = new fromActions.InputDataFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputData$).toBeObservable(expected);
    });
  });

  describe('addInputData$', () => {
    it('should dispatch FinishedGenericNetworkRequestForInputData', () => {
      const action = new fromActions.AddInputData({name: '', description: ''}  as any);
      const completion = new fromActions.FinishedGenericNetworkRequestForInputData();
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });
   
      expect(effects.addInputData$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddInputData({name: '#newtag', description: ''} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.InputData});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addInputData$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddInputData({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addInputData$).toBeObservable(expected);
    });

    it('should dispatch GenericInputDataFailure if the service throws an error', () => {
      (service.create as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddInputData({name: '', description: ''} as any);
      const completion = new fromActions.GenericInputDataFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addInputData$).toBeObservable(expected);
    });
  });

  describe('updateInputData$', () => {
    it('should dispatch FinishedNetworkRequestForInputData', () => {
      const action = new fromActions.UpdateInputData({
        inputData: createTestInputData({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForInputData('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateInputData$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateInputData({
        inputData: createTestInputData({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        }  
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.InputData});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateInputData$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateInputData({
        inputData: createTestInputData({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name',
          description: ''
        }       
      });
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateInputData$).toBeObservable(expected);
    });

    it('should dispatch InputDataFailure if the service throws an error', () => {
      (service.patch as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.UpdateInputData({
        inputData: { _links: {} as any, name: 'new name', id: 'some id' }
      });
      const completion = new fromActions.InputDataFailure({ error: new Error('error message'), id: 'some id' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateInputData$).toBeObservable(expected);
    });

  it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const action = new fromActions.UpdateInputData({
        inputData: createTestInputData({id: '12345'}),
      });
      const completion = new fromActions.FinishedNetworkRequestForInputData('12345');
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateInputData$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.inputData');
    });
  });

  describe('deleteInputData$', () => {
    it('should dispatch FinishedNetworkRequestForInputData', () => {
      const action = new fromActions.DeleteInputData({ id: '12345' } as any);
      const completion = new fromActions.FinishedNetworkRequestForInputData('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteInputData$).toBeObservable(expected);
    });

    it('should dispatch InputDataFailure if the service throws an error', () => {
      (service.delete as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.DeleteInputData({ id: '12345' } as any);
      const completion = new fromActions.InputDataFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteInputData$).toBeObservable(expected);
    });
  });

  describe('addRelatedObjectToInputData$', () => {
    it('should dispatch FinishedNetworkRequestForInputData', () => {
      const action = new fromActions.AddRelatedObjectToInputData({
        sourceObject: createTestInputData({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.FinishedNetworkRequestForInputData('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToInputData$).toBeObservable(expected);
    });

    it('should dispatch InputDataFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddRelatedObjectToInputData({
        sourceObject: createTestInputData({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.InputDataFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addRelatedObjectToInputData$).toBeObservable(expected);
    });
  });

  describe('removeRelatedObjectFromInputData$', () => {
    it('should dispatch FinishedNetworkRequestForInputData', () => {
      const action = new fromActions.RemoveRelatedObjectFromInputData({
        sourceObject: createTestInputData({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.FinishedNetworkRequestForInputData('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromInputData$).toBeObservable(expected);
    });

    it('should dispatch InputDataFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveRelatedObjectFromInputData({
        sourceObject: createTestInputData({id: '12345'}),
        relatedObject: createTestOrganization(),
        relationPath: ObjectRelationsNames.Organizations,
      });
      const completion = new fromActions.InputDataFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeRelatedObjectFromInputData$).toBeObservable(expected);
    });
  });

  describe('loadInputDataAsChild$', () => {
    it('should dispatch UpdateDiagramGraphableObject for update InputDatas', () => {
      const action = new fromActions.LoadInputDataAsChild('12345');
      const completion = new fromActions.UpdateDiagramGraphableObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.InputDatas]});
      const expected = cold('-(bcde)', {
        b: completion,
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputDataAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateDecisionRelatedObject for update RequiresInputDatas', () => {
      const action = new fromActions.LoadInputDataAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.RequiresInputData]});
      const expected = cold('-(bcde)', {
        b: jasmine.anything(),
        c: completion,
        d: jasmine.anything(),
        e: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputDataAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateKnowledgeSourceRelatedObject for update RequiresInputDatas', () => {
      const action = new fromActions.LoadInputDataAsChild('12345');
      const completion = new fromActions.UpdateKnowledgeSourceRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.RequiresInputData]});
      const expected = cold('-(bcde)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: completion,
        e: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputDataAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateOrganizationRelatedObject for update InputDatas', () => {
      const action = new fromActions.LoadInputDataAsChild('12345');
      const completion =  new fromActions.UpdateOrganizationRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.InputDatas]});
      const expected = cold('-(bcde)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: jasmine.anything(),
        e: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputDataAsChild$).toBeObservable(expected);
    });

    it('should dispatch InputDataFailure if the service throws an error', () => {
      (service.getSingleObjectForDiagram as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadInputDataAsChild('12345');
      const completion = new fromActions.InputDataFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadInputDataAsChild$).toBeObservable(expected);
    });
  });

  describe('InputDataFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.InputDataFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.inputDataFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.inputData');
    });
  });

  describe('genericInputDataFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.GenericInputDataFailure(new Error('error message'));
      const expected = cold('-b', { b: action });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericInputDataFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.inputData');
    });
  });

  describe('removePreviewInputDataFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveInputDataFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewInputDataFromLocalMemory('123');
      const completion = new fromActions.RemoveInputDataFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewInputDataFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewInputDataFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewInputDataFromLocalMemory$).toBeObservable(expected);
    });
  });

  function createTestInputData(inputData: {id: string}): InputData {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: inputData.id,
      _links: {
        self: {
          href: 'https://'
        },
        organizations: {
          href: 'https://'
        }
      } as any,
    } as InputData;
  }

  function createTestOrganization(): Organization {
    return {   
      name: 'new name', 
      description: 'new description', 
      id: 'some id',
      _links: {
        self: {
          href: 'https://'
        }
      } as any,
    } as Organization;
  }
});

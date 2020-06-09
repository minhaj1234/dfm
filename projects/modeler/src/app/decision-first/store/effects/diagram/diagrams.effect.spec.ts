import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeMessageService } from 'core/testing';
import { FakeExternalService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { Diagram } from '../../../models/diagram.model';
import { DiagramNodeDefaultName } from '../../../models/goJsDiagram.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../models/objects.model';
import { Sketch } from '../../../models/sketch.model';
import { DiagramsService } from '../../../services';
import * as fromModelerStoreReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { getPreventDuplicateNameMessage } from '../../../utilitites/getPreventDuplicateNameMessage';
import { AddTab, NoOpAction } from '../../actions';
import * as fromActions from '../../actions';
import * as fromDiagramsActions from '../../actions/diagram/diagrams.actions';
import * as fromEffects from './diagrams.effect';

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

describe('Diagrams Effects', () => {
  let actions$: TestActions;
  let service: DiagramsService;
  let effects: fromEffects.DiagramsEffects;
  let messageService: MessageService;
  let store: Store<fromModelerStoreReducers.IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        DiagramsService,
        fromEffects.DiagramsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(DiagramsService);
    effects = TestBed.get(fromEffects.DiagramsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));
    store.dispatch(new AddTab({
      id: '12345',
      type: ObjectTabType.Diagram,
    }));

    spyOn(service, 'create').and.returnValue(of({id: '12345'} as any));
    spyOn(service, 'delete').and.returnValue(of({}));
    spyOn(service, 'patch').and.returnValue(of({} as any));
    spyOn(service, 'getSingleMinimal').and.returnValue(of({} as any));
    spyOn(service, 'getSingleEdit').and.returnValue(of({} as any));
    spyOn(service, 'addRelatedObject').and.returnValue(of({}));
    spyOn(service, 'removeRelatedObject').and.returnValue(of({}));
    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showWarning');
  });

  describe('loadDiagram$', () => {
    it('should dispatch LoadDiagramSuccess', () => {
      const diagram: Diagram = {} as any;
      const action = new fromActions.LoadDiagram('some uuid');
      const completion = new fromDiagramsActions.LoadDiagramSuccess(diagram);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDiagram$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.LoadDiagram('some uuid');
      const completion = new fromActions.DiagramFailure({ error, id: 'some uuid' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDiagram$).toBeObservable(expected);
    });
  });

  describe('addDiagram$', () => {
    it('should dispatch UpdateObjectTags if there are tags', () => {
      const action = new fromActions.AddDiagram({id: '12345', name: '#newtag'} as any);
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], id: '12345', type: ObjectClassNames.Diagram});
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addDiagram$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if there are no tags', () => {
      const action = new fromActions.AddDiagram({name: '', description: ''} as any);
      const completion = new fromActions.NoOpAction();
      const expected = cold('-(c)', {
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });
     
      expect(effects.addDiagram$).toBeObservable(expected);
    });

    it('should dispatch DiagramFailure if the service throws an error', () => {
      const error = new Error('error message');
      (service.create as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.AddDiagram({name: '', description: ''} as any);
      const completion = new fromActions.DiagramFailure({ error, id: '' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addDiagram$).toBeObservable(expected);
    });
  });

  describe('updateDiagram$', () => {
    it('should dispatch FinishedNetworkRequestForDiagram', () => {
      const diagram = getDiagram({id: '12345'});      
      const action = new fromActions.UpdateDiagram({diagram});
      const completion = new fromDiagramsActions.FinishedNetworkRequestForDiagram(diagram.id);
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDiagram$).toBeObservable(expected);
    });

    it('should dispatch UpdateObjectTags if tags is changed', () => {
      const action = new fromActions.UpdateDiagram({
        diagram: getDiagram({id: '12345'}),
        objectTagsUpdate: {
          tags: [],
          name: 'name #newtag name',
          description: ''
        } 
      });
      const completion = new fromActions.UpdateObjectTags({ missingTagNames: ['#newtag'], extraTagIds: [], id: '12345', type: ObjectClassNames.Diagram});
      const expected = cold('-(bc)', {
        b: jasmine.anything(),
        c: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDiagram$).toBeObservable(expected);
    });

    it('should dispatch NoOpAction if tags are not changed', () => {
      const action = new fromActions.UpdateDiagram({
        diagram: getDiagram({id: '12345'}),
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

      expect(effects.updateDiagram$).toBeObservable(expected);
    });

    it('should dispatch DiagramFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.patch as jasmine.Spy).and.returnValue(throwError(error));
      const diagram = getDiagram({id: '12345'});      
      const action = new fromActions.UpdateDiagram({diagram});
      const completion = new fromActions.DiagramFailure({ error, id: diagram.id });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDiagram$).toBeObservable(expected);
    });

    it('should call messageService.showWarning', () => {
      (service.patch as jasmine.Spy).and.returnValue(of({id: '12345', name: 'changed name'}));
      const diagram = getDiagram({id: '12345'});      
      const action = new fromActions.UpdateDiagram({diagram});
      const completion = new fromDiagramsActions.FinishedNetworkRequestForDiagram(diagram.id);
      const expected = cold('-(bc)', {
        b: completion,
        c: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateDiagram$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith(getPreventDuplicateNameMessage('changed name'), 'resources.diagram');
    });
  });

  describe('deleteDiagram$', () => {
    it('should dispatch FinishedNetworkRequestForDiagram', () => {
      const diagram: Diagram = { id: 'some uuid' } as any;
      const action = new fromActions.DeleteDiagram(diagram);
      const completion = new NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteDiagram$).toBeObservable(expected);
    });

    it('should dispatch DecisionFailure if the service throws an error', () => {
      const diagram: Diagram = { id: 'some uuid' } as any;
      const error = new Error('some error');
      (service.delete as jasmine.Spy).and.returnValue(throwError(error));
      const action = new fromActions.DeleteDiagram(diagram);
      const completion = new fromActions.DiagramFailure({ error, id: 'some uuid' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.deleteDiagram$).toBeObservable(expected);
    });
  });

  describe('addGraphableObjectToDiagram$', () => {
    it('should dispatch FinishedNetworkRequestForDiagram', () => {
      const action = new fromActions.AddGraphableObjectToDiagram({
        sourceObject: getDiagram({id: '12345'}),
        relatedObject: createTestKnowledgeSource(),
        relationPath: ObjectRelationsNames.KnowledgeSources,
        isNew: false,
      });
      const completion = new fromActions.FinishedNetworkRequestForDiagram('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addGraphableObjectToDiagram$).toBeObservable(expected);
    });

    it('should dispatch DiagramFailure if the service throws an error', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.AddGraphableObjectToDiagram({
        sourceObject: getDiagram({id: '12345'}),
        relatedObject: createTestKnowledgeSource(),
        relationPath: ObjectRelationsNames.KnowledgeSources,
        isNew: false,
      });
      const completion = new fromActions.DiagramFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addGraphableObjectToDiagram$).toBeObservable(expected);
    });

    it('should call messageService if name was changed', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(of({name: 'new Object name'}));
      const action = new fromActions.AddGraphableObjectToDiagram({
        sourceObject: getDiagram({id: '12345'}),
        relatedObject: createTestKnowledgeSource(),
        relationPath: ObjectRelationsNames.KnowledgeSources,
        isNew: true,
      });
      const completion = new fromActions.FinishedNetworkRequestForDiagram('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addGraphableObjectToDiagram$).toBeObservable(expected);
      expect(messageService.showWarning).toHaveBeenCalledWith([
        'resources.nameChangedTo', 
        ` 'new Object name' `, 
        'resources.toAvoidDuplication'
      ], 
      'resources.diagram');
    });

    it('should not call messageService if name not changed', () => {
      (service.addRelatedObject as jasmine.Spy).and.returnValue(of({name: DiagramNodeDefaultName.Decision}));
      const action = new fromActions.AddGraphableObjectToDiagram({
        sourceObject: getDiagram({id: '12345'}),
        relatedObject: createTestKnowledgeSource(),
        relationPath: ObjectRelationsNames.KnowledgeSources,
        isNew: false,
      });
      const completion = new fromActions.FinishedNetworkRequestForDiagram('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.addGraphableObjectToDiagram$).toBeObservable(expected);
      expect(messageService.showWarning).not.toHaveBeenCalled();
    });
  });

  describe('removeGraphableObjectFromDiagram$', () => {
    it('should dispatch FinishedNetworkRequestForDiagram', () => {
      const action = new fromActions.RemoveGraphableObjectsFromDiagram({
        diagram: getDiagram({id: '12345'}),
        deletedGraphables: [{
          graphable: createTestKnowledgeSource(),
          relationPath: ObjectRelationsNames.KnowledgeSources,
        },
        {
          graphable: createTestKnowledgeSource(),
          relationPath: ObjectRelationsNames.KnowledgeSources,
        }]
      });
      const completion = new fromActions.FinishedNetworkRequestForDiagram('12345');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeGraphableObjectsFromDiagram$).toBeObservable(expected);
    });

    it('should dispatch DiagramFailure if the service throws an error', () => {
      (service.removeRelatedObject as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.RemoveGraphableObjectsFromDiagram({
        diagram: getDiagram({id: '12345'}),
        deletedGraphables: [{
          graphable: createTestKnowledgeSource(),
          relationPath: ObjectRelationsNames.KnowledgeSources,}]
      });
      const completion = new fromActions.DiagramFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removeGraphableObjectsFromDiagram$).toBeObservable(expected);
    });
  });

  describe('loadDiagramAsChild$', () => {
    it('should dispatch UpdateDecisionRelatedObject for update Diagrams', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(of({id: '12345'}));
      const action = new fromActions.LoadDiagramAsChild('12345');
      const completion = new fromActions.UpdateDecisionRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Diagrams]});
      const expected = cold('-(bcd)', {
        b: completion,
        c: jasmine.anything(),
        d: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDiagramAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateInputDataRelatedObject for update Diagrams', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(of({id: '12345'}));
      const action = new fromActions.LoadDiagramAsChild('12345');
      const completion = new fromActions.UpdateInputDataRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Diagrams]});
      const expected = cold('-(bcd)', {
        b: jasmine.anything(),
        c: completion,
        d: jasmine.anything(),
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDiagramAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateKnowledgeSourceRelatedObject for update Diagrams', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(of({id: '12345'}));
      const action = new fromActions.LoadDiagramAsChild('12345');
      const completion = new fromActions.UpdateKnowledgeSourceRelatedObject({object: { id: '12345' } as any, paths: [ObjectRelationsNames.Diagrams]});
      const expected = cold('-(bcd)', {
        b: jasmine.anything(),
        c: jasmine.anything(),
        d: completion,
      });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDiagramAsChild$).toBeObservable(expected);
    });

    it('should dispatch UpdateDiagramInKnowledgeSources', () => {
      (service.getSingleMinimal as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadDiagramAsChild('12345');
      const completion = new fromActions.DiagramFailure({ error: new Error('error message'), id: '12345' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadDiagramAsChild$).toBeObservable(expected);
    });
  });

  describe('updateSketchObject$', () => {
    it('should dispatch FinishedNetworkRequestForDiagram', () => {
      const diagram: Diagram = { id: 'some uuid', _links: {}, goNodes: JSON.stringify({'sketchId': {text: ''}}) } as any;
      const sketch = {id: 'sketchId', description: ''} as Sketch;
      (service.patch as jasmine.Spy).and.returnValue(of(diagram));
      const action = new fromActions.UpdateSketchObject({ diagram: diagram, sketch });
      const completion = new fromDiagramsActions.FinishedNetworkRequestForDiagram(diagram.id);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateSketchObject$).toBeObservable(expected);
    });

    it('should dispatch DiagramFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.patch as jasmine.Spy).and.returnValue(throwError(error));
      const diagram: Diagram = { id: 'some uuid', _links: {}, goNodes: JSON.stringify({'sketchId': {text: ''}}) } as any;
      const sketch = {id: 'sketchId', description: ''} as Sketch;
      const action = new fromActions.UpdateSketchObject({ diagram: diagram, sketch });
      const completion = new fromActions.DiagramFailure({ error, id: 'some uuid' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateSketchObject$).toBeObservable(expected);
    });
  });

  describe('updateGoJson$', () => {
    it('should dispatch FinishedNetworkRequestForDiagram', () => {
      const diagram: Diagram = { id: 'some uuid', _links: {} } as any;
      const action = new fromActions.UpdateGoJson({ diagram, goNodes: 'goNodes', goLocations: 'goLocations', goConnectors: 'goConnectors'});
      const completion = new fromDiagramsActions.FinishedNetworkRequestForDiagram(diagram.id);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateGoJson$).toBeObservable(expected);
    });

    it('should dispatch DiagramFailure if the service throws an error', () => {
      const error = new Error('some error');
      (service.patch as jasmine.Spy).and.returnValue(throwError(error));
      const diagram: Diagram = { id: 'some uuid', _links: {} } as any;
      const action = new fromActions.UpdateGoJson({ diagram });
      const completion = new fromActions.DiagramFailure({ error, id: 'some uuid' });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateGoJson$).toBeObservable(expected);
    });
  });
 
  describe('diagramFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      const action = new fromActions.DiagramFailure({ error: new Error('error message'), id: 'some uuid' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.diagramsFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalledWith(new Error('error message'), 'resources.diagram');
    });
  });

  describe('removePreviewDiagramFromLocalMemory$', () => {
    it('should dispatch should dispatch RemoveDiagramFromLocalMemory', () => {
      const action = new fromActions.RemovePreviewDiagramFromLocalMemory('123');
      const completion = new fromDiagramsActions.RemoveDiagramFromLocalMemory('123');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewDiagramFromLocalMemory$).toBeObservable(expected);
    });

    it('should dispatch should dispatch NoOpAction', () => {

      const action = new fromActions.RemovePreviewDiagramFromLocalMemory('12345');
      const completion = new fromActions.NoOpAction();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.removePreviewDiagramFromLocalMemory$).toBeObservable(expected);
    });
  });

  function getDiagram(diagram: {id: string}): Diagram {
    return {
      _links: {
        self: {
          href: 'https://'
        },
        knowledgeSources: {
          href: 'https://'
        }
      } as any,
      name: 'new name', 
      description: 'new description', 
      id: diagram.id,
    } as Diagram;
  }

  function createTestKnowledgeSource(): KnowledgeSource {
    return {
      _links: {
        self: {
          href: 'https://'
        }
      } as any, 
      name: 'new name', 
      description: 'new description', 
      id: 'some id',
    } as KnowledgeSource;
  }
});

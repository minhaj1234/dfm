import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { getDebugElement } from 'core/testing';
import { GraphablePrimaryDiagramComponent } from '../..';
import { Config } from '../../../../config';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { Graphable } from '../../../models/graphable.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { AddTab, IDecisionFirstState, UpdateDecision, UpdateInputData, UpdateKnowledgeSource } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';

describe('GraphablePrimaryDiagramComponent', () => {
  let component: GraphablePrimaryDiagramComponent;
  let fixture: ComponentFixture<GraphablePrimaryDiagramComponent>;
  let dispatch: jasmine.Spy;
  let store: Store<IDecisionFirstState>;
  let selectPrimaryDiagramId: any;

  const firstDiagram = new Diagram();
  firstDiagram.id = 'first-diagram';

  const secondDiagram = new Diagram();
  secondDiagram.id = 'second-diagram';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphablePrimaryDiagramComponent],
      imports: [
        FormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    dispatch = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(GraphablePrimaryDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateGraphable', () => {
    beforeEach(() => {
      selectPrimaryDiagramId = getDebugElement(fixture, '.select-primary-diagram-id').nativeElement;
    });

    it('dispatches an UpdateDecision on value changes', (() => {
      const decision = new Decision();
      decision.id = 'decisionId';
      decision.diagrams = [firstDiagram, secondDiagram];
      decision._links = { self: { href: 'http://self' } } as any;
      component.graphable = decision;

      fixture.detectChanges();

      selectPrimaryDiagramId.value = selectPrimaryDiagramId.options[1].value;
      selectPrimaryDiagramId.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(dispatch.calls.first().args[0]).toEqual(
        new UpdateDecision({
          decision: {
            id: decision.id,
            primaryDiagramId: decision.diagrams[0].id,
            _links: decision._links,
          }
        }),
      );
    }));

    it('dispatches an UpdateInputData on value changes', (() => {
      const inputData = new InputData();
      inputData.id = 'knowledgeSourceId';
      inputData.diagrams = [firstDiagram, secondDiagram];
      inputData._links = { self: { href: 'http://self' } } as any;
      component.graphable = inputData;

      fixture.detectChanges();

      selectPrimaryDiagramId.value = selectPrimaryDiagramId.options[1].value;
      selectPrimaryDiagramId.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(dispatch.calls.first().args[0]).toEqual(
        new UpdateInputData({
          inputData: {
            id: inputData.id,
            primaryDiagramId: inputData.diagrams[0].id,
            _links: inputData._links,
          }
        }),
      );
    }));

    it('dispatches an UpdateKnowledgeSource on value changes', (() => {
      const knowledgeSource = new KnowledgeSource();
      knowledgeSource.id = 'knowledgeSourceId';
      knowledgeSource.diagrams = [firstDiagram, secondDiagram];
      knowledgeSource._links = { self: { href: 'http://self' } } as any;
      component.graphable = knowledgeSource;

      fixture.detectChanges();

      selectPrimaryDiagramId.value = selectPrimaryDiagramId.options[1].value;
      selectPrimaryDiagramId.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(dispatch.calls.first().args[0]).toEqual(
        new UpdateKnowledgeSource({
          knowledgeSource: {
            id: knowledgeSource.id,
            primaryDiagramId: knowledgeSource.diagrams[0].id,
            _links: knowledgeSource._links,
          }
        }),
      );
    }));
  });

  describe('primaryDiagramId', () => {
    it('should return primary diagram id', () => {
      const graphable = { primaryDiagramId: 'primaryDiagramId' } as Graphable;
      component.graphable = graphable;

      expect(component.primaryDiagramId).toEqual('primaryDiagramId');
    });
  });

  describe('diagrams', () => {
    it('should return diagrams array', () => {
      const graphable = { diagrams: [{ id: 'diagram1' } as Diagram] } as Graphable;
      component.graphable = graphable;

      expect(component.diagrams).toEqual(graphable.diagrams);
    });
  });

  describe('openSelectedDiagram', () => {
    it('should call openTab', () => {
      spyOn(component, 'openTab');
      component.primaryDiagramId = 'diagram1';

      component.openSelectedDiagram();

      expect(component.openTab).toHaveBeenCalledWith('diagram1');
    });

    it('should open tab', () => {
      component.primaryDiagramId = 'diagram1';

      component.openSelectedDiagram();

      expect(dispatch.calls.first().args[0]).toEqual(
        new AddTab({
          id: 'diagram1',
          type: ObjectTabType.Diagram,
        }),
      );
    });
  });

  describe('isCanOpenPrimaryDiagram', () => {
    it('should return true if primary diagram exists', fakeAsync(() => {
      const decision = new Decision();
      decision.id = 'decisionId';
      decision.primaryDiagramId = 'primaryDiagramId';
      decision._links = { self: { href: 'http://self' } } as any;
      decision.diagrams = [{ id: 'primaryDiagramId' } as any];
      component.graphable = decision;

      tick(Config.debounceTime);

      expect(component.isCanOpenPrimaryDiagram()).toBeTruthy();
    }));
  });
});

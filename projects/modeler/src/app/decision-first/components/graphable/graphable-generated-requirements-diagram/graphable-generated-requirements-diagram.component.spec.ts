import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ResizableModule } from 'angular-resizable-element';
import { triggerMouseClick } from 'core/testing';
import { decisionsData } from '../../../services/decisions.service.spec-data';
import * as fromModelerStore from '../../../store';
import { emulateDiagramClick } from '../../../testing/emulate-diagram-click.spec';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { toDecision } from '../../../utilitites/mappings';
import { GraphableGeneratedRequirementsDiagramComponent } from './graphable-generated-requirements-diagram.component';

describe('GraphableGeneratedRequirementsDiagramComponent', () => {
  let component: GraphableGeneratedRequirementsDiagramComponent;
  let fixture: ComponentFixture<GraphableGeneratedRequirementsDiagramComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  const decision = toDecision(decisionsData._embedded.decisions[0]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphableGeneratedRequirementsDiagramComponent],
      imports: [
        ResizableModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(GraphableGeneratedRequirementsDiagramComponent);
    component = fixture.componentInstance;
    component.graphable = decision;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('object tab', () => {
    it('should open', () => {
      const node = component.requirementsDiagram.nodes.first();
      emulateDiagramClick(component.requirementsDiagram, node.location.x, node.location.y, 2);
      
      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddTab({
        id: node.data.data.id,
        type: node.data.data.className
      }));
    });
  });

  describe('zoom', () => {
    it('should call increaseZoom command', () => {
      spyOn(component.requirementsDiagram.commandHandler, 'increaseZoom');
      triggerMouseClick(fixture, '.zoom-in');
      expect(component.requirementsDiagram.commandHandler.increaseZoom).toHaveBeenCalled();
    });

    it('should call decreaseZoom command', () => {
      spyOn(component.requirementsDiagram.commandHandler, 'decreaseZoom');
      triggerMouseClick(fixture, '.zoom-out');
      expect(component.requirementsDiagram.commandHandler.decreaseZoom).toHaveBeenCalled();
    });
  });
});

import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { getDebugElement, triggerMouseClick, MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { BusinessObjective } from '../../../models/businessObjective.model';
import { Decision } from '../../../models/decision.model';
import { Diagram } from '../../../models/diagram.model';
import { Event } from '../../../models/events.model';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { Organization } from '../../../models/organization.model';
import { Process } from '../../../models/process.model';
import { SearchListItemType } from '../../../models/search.model';
import { System } from '../../../models/system.model';
import * as fromModelerStore from '../../../store';
import { AddTab, DeleteDecision, DeleteDiagram, DeleteKnowledgeSource, DeleteOrganization } from '../../../store/actions';
import { SearchListItemComponent } from './search-list-item.component';

describe('SearchListItemComponent', () => {
  let component: SearchListItemComponent;
  let fixture: ComponentFixture<SearchListItemComponent>;
  let dispatchModelerStore: jasmine.Spy;
  let modelerStore: MockStore<fromModelerStore.IDecisionFirstState>;

  const diagram = new Diagram();
  diagram.id = 'diagram1000';
  const decision = new Decision();
  decision.id = 'decision1000';
  const inputData = new InputData();
  inputData.id = 'inputData1000';
  const knowledgeSource = new KnowledgeSource();
  knowledgeSource.id = 'knowledgeSource1000';
  const organization = new Organization();
  organization.id = 'organization1000';
  const businessObjective = new BusinessObjective();
  businessObjective.id = 'businessObjective1000';
  const process = new Process();
  process.id = 'process1000';
  const event = new Event();
  event.id = 'event1000';
  const system = new System();
  system.id = 'system1000';
  const implementationComponent = new ImplementationComponent();
  implementationComponent.id = 'implementationComponent1000';
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchListItemComponent,
        MockComponent({ selector: 'core-view-multiple-lines-control', inputs: ['text'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
      ],
      imports: [
        ReactiveFormsModule,
        DmsThemeModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideMockStore(),
      ]
    })
    .overrideComponent(SearchListItemComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    
    fixture = TestBed.createComponent(SearchListItemComponent);
    component = fixture.componentInstance;
    component.searchItem = inputData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when SearchListItemType is FullSearchListItem' , () => {
    describe('is read only mode', () => {
      it('should show delete icon', () => {
        component.isReadOnly = false;
        fixture.detectChanges();
        const deleteIcon = getDebugElement(fixture, 'i[data-action="delete-inputData1000"]');
        expect(deleteIcon).toBeTruthy();
      });
  
      it('should remove delete icon', () => {
        component.isReadOnly = true;
        fixture.detectChanges();
        const deleteIcon = getDebugElement(fixture, 'i[data-action="delete-inputData1000"]');
        expect(deleteIcon).toBeFalsy();
      });
    });
  
    describe('Add Tab', () => {
      it('dispatches an addTab event when the diagram is clicked', () => {
        component.searchItem = diagram;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-diagram1000"]');
       
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'diagram1000', type: ObjectTabType.Diagram }),
        });
      }); 
  
      it('dispatches an addTab event when the decision is clicked', () => {
        component.searchItem = decision;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-decision1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'decision1000', type: ObjectTabType.Decision }),
        });
      });
  
      it('dispatches an addTab event when the input data is clicked', () => {
        component.searchItem = inputData;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-inputData1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'inputData1000', type: ObjectTabType.InputData }),
        });
      });
  
      it('dispatches an addTab event when the knowledge source is clicked', () => {
        component.searchItem = knowledgeSource;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-knowledgeSource1000"]'))
          .triggerEventHandler('click', null);
        
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'knowledgeSource1000', type: ObjectTabType.KnowledgeSource }),
        });
      });
  
      it('dispatches an addTab event when the organization is clicked', () => {
        component.searchItem = organization;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-organization1000"]'))
          .triggerEventHandler('click', null);
        
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'organization1000', type: ObjectTabType.Organization }),
        });
      });
  
      it('dispatches an addTab event when the business objective is clicked', () => {
        component.searchItem = businessObjective;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-businessObjective1000"]'))
          .triggerEventHandler('click', null);
       
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'businessObjective1000', type: ObjectTabType.BusinessObjective }),
        });
      });
  
      it('dispatches an addTab event when the process is clicked', () => {
        component.searchItem = process;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-process1000"]');
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'process1000', type: ObjectTabType.Process }),
        });
      });
  
      it('dispatches an addTab event when the event is clicked', () => {
        component.searchItem = event;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-event1000"]');
       
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'event1000', type: ObjectTabType.Event }),
        });
      });
  
      it('dispatches an addTab event when the system is clicked', () => {
        component.searchItem = system;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-system1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'system1000', type: ObjectTabType.System }),
        });
      });
  
      it('dispatches an addTab event when the implementation component is clicked', () => {
        component.searchItem = implementationComponent;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-implementationComponent1000"]'))
          .triggerEventHandler('click', null);
  
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'implementationComponent1000', type: ObjectTabType.ImplementationComponent }),
        });
      });
    });
  
    describe('Remove Object', () => {
      it('dispatches an DeleteDiagram action when the diagram delete button is clicked', () => {
        component.searchItem = diagram;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-diagram1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteDiagram(diagram),
        });
      });
  
      it('dispatches an DeleteDecision action when the decision delete button is clicked', () => {
        component.searchItem = decision;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-decision1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteDecision(decision),
        });
      });
  
      it('should delete input data', () => {
        component.searchItem = inputData;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-inputData1000"]');
       
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteInputData(inputData));
      });
  
      it('dispatches an DeleteKnowledgeSource action when the knowledge source delete button is clicked', () => {
        component.searchItem = knowledgeSource;
        fixture.detectChanges();
        
        fixture.debugElement
          .query(By.css('i[data-action="delete-knowledgeSource1000"]'))
          .triggerEventHandler('click', null);
        
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteKnowledgeSource(knowledgeSource),
        });
      });
  
      it('dispatches an DeleteOrganization action when the organization delete button is clicked', () => {
        component.searchItem = organization;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-organization1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteOrganization(organization),
        });
      });
  
      it('should delete business objective', () => {
        component.searchItem = businessObjective;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-businessObjective1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteBusinessObjective(businessObjective));
      });
  
      it('should delete process', () => {
        component.searchItem = process;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-process1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteProcess(process));
      });
  
      it('should delete event', () => {
        component.searchItem = event;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-event1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteEvent(event));
      });
  
      it('should delete system', () => {
        component.searchItem = system;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-system1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteSystem(system));
      });
  
      it('should delete implementation component', () => {
        component.searchItem = implementationComponent;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-implementationComponent1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteImplementationComponent(implementationComponent));
      });
    });
  });

  describe('when SearchListItemType is FullSearchListItem' , () => {
    beforeEach(() => {
      component.type = SearchListItemType.ShortSearchListItem;
      fixture.detectChanges();
    });

    describe('is read only mode', () => {
      it('should show delete icon', () => {
        component.isReadOnly = false;
        fixture.detectChanges();
        const deleteIcon = getDebugElement(fixture, 'i[data-action="delete-inputData1000"]');
        expect(deleteIcon).toBeTruthy();
      });
  
      it('should remove delete icon', () => {
        component.isReadOnly = true;
        fixture.detectChanges();
        const deleteIcon = getDebugElement(fixture, 'i[data-action="delete-inputData1000"]');
        expect(deleteIcon).toBeFalsy();
      });
    });
  
    describe('Add Tab', () => {
      it('dispatches an addTab event when the diagram is clicked', () => {
        component.searchItem = diagram;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-diagram1000"]');
       
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'diagram1000', type: ObjectTabType.Diagram }),
        });
      }); 
  
      it('dispatches an addTab event when the decision is clicked', () => {
        component.searchItem = decision;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-decision1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'decision1000', type: ObjectTabType.Decision }),
        });
      });
  
      it('dispatches an addTab event when the input data is clicked', () => {
        component.searchItem = inputData;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-inputData1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'inputData1000', type: ObjectTabType.InputData }),
        });
      });
  
      it('dispatches an addTab event when the knowledge source is clicked', () => {
        component.searchItem = knowledgeSource;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-knowledgeSource1000"]'))
          .triggerEventHandler('click', null);
        
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'knowledgeSource1000', type: ObjectTabType.KnowledgeSource }),
        });
      });
  
      it('dispatches an addTab event when the organization is clicked', () => {
        component.searchItem = organization;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-organization1000"]'))
          .triggerEventHandler('click', null);
        
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'organization1000', type: ObjectTabType.Organization }),
        });
      });
  
      it('dispatches an addTab event when the business objective is clicked', () => {
        component.searchItem = businessObjective;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-businessObjective1000"]'))
          .triggerEventHandler('click', null);
       
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'businessObjective1000', type: ObjectTabType.BusinessObjective }),
        });
      });
  
      it('dispatches an addTab event when the process is clicked', () => {
        component.searchItem = process;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-process1000"]');
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'process1000', type: ObjectTabType.Process }),
        });
      });
  
      it('dispatches an addTab event when the event is clicked', () => {
        component.searchItem = event;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-event1000"]');
       
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'event1000', type: ObjectTabType.Event }),
        });
      });
  
      it('dispatches an addTab event when the system is clicked', () => {
        component.searchItem = system;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'span[data-action="open-tab-system1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'system1000', type: ObjectTabType.System }),
        });
      });
  
      it('dispatches an addTab event when the implementation component is clicked', () => {
        component.searchItem = implementationComponent;
        fixture.detectChanges();
  
        fixture.debugElement
          .query(By.css('span[data-action="open-tab-implementationComponent1000"]'))
          .triggerEventHandler('click', null);
  
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new AddTab({ id: 'implementationComponent1000', type: ObjectTabType.ImplementationComponent }),
        });
      });
    });
  
    describe('Remove Object', () => {
      it('dispatches an DeleteDiagram action when the diagram delete button is clicked', () => {
        component.searchItem = diagram;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-diagram1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteDiagram(diagram),
        });
      });
  
      it('dispatches an DeleteDecision action when the decision delete button is clicked', () => {
        component.searchItem = decision;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-decision1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteDecision(decision),
        });
      });
  
      it('should delete input data', () => {
        component.searchItem = inputData;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-inputData1000"]');
       
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteInputData(inputData));
      });
  
      it('dispatches an DeleteKnowledgeSource action when the knowledge source delete button is clicked', () => {
        component.searchItem = knowledgeSource;
        fixture.detectChanges();
        
        fixture.debugElement
          .query(By.css('i[data-action="delete-knowledgeSource1000"]'))
          .triggerEventHandler('click', null);
        
          expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteKnowledgeSource(knowledgeSource),
        });
      });
  
      it('dispatches an DeleteOrganization action when the organization delete button is clicked', () => {
        component.searchItem = organization;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-organization1000"]');
        
        expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({
          ...new DeleteOrganization(organization),
        });
      });
  
      it('should delete business objective', () => {
        component.searchItem = businessObjective;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-businessObjective1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteBusinessObjective(businessObjective));
      });
  
      it('should delete process', () => {
        component.searchItem = process;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-process1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteProcess(process));
      });
  
      it('should delete event', () => {
        component.searchItem = event;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-event1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteEvent(event));
      });
  
      it('should delete system', () => {
        component.searchItem = system;
        fixture.detectChanges();
  
        triggerMouseClick(fixture, 'i[data-action="delete-system1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteSystem(system));
      });
  
      it('should delete implementation component', () => {
        component.searchItem = implementationComponent;
        fixture.detectChanges();
        
        triggerMouseClick(fixture, 'i[data-action="delete-implementationComponent1000"]');
        
        expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.DeleteImplementationComponent(implementationComponent));
      });
    });
  });
});

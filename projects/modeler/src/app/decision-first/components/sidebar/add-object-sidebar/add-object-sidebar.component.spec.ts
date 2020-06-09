import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbDialogService, NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarPanel } from 'core/objects/sidebar/models';
import { triggerMouseClick } from 'core/testing';
import * as fromComponents from '../..';
import { DmsThemeModule } from '../../../../theme';
import * as fromRoot from '../../../store';
import * as fromReducers from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddObjectSidebarComponent } from './add-object-sidebar.component';

describe('AddObjectSidebarComponent', () => {
  let component: AddObjectSidebarComponent;
  let fixture: ComponentFixture<AddObjectSidebarComponent>;
  let store: Store<fromReducers.IDecisionFirstState>;
  let nbDialogService: NbDialogService;
  let openDialog: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddObjectSidebarComponent
      ],
      imports: [
        DmsThemeModule, 
        NbThemeModule.forRoot(), 
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
      providers: [NbDialogService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectSidebarComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    nbDialogService = TestBed.get(NbDialogService);
    openDialog = spyOn(nbDialogService, 'open');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open navigation sidebar panel', () => {
    triggerMouseClick(fixture, '#openNavigationSidebarPanel');
    expect(store.dispatch).toHaveBeenCalledWith(new fromRoot.SetCurrentSidebarPanel(SidebarPanel.Navigation));
  });

  it('should open dialog with create form for diagram', () => {
    triggerMouseClick(fixture, '#addDiagram');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddDiagramComponent);
  });

  it('should open dialog with create form for decision', () => {
    triggerMouseClick(fixture, '#addDecision');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddDecisionComponent);
  });

  it('should open dialog with create form for input data', () => {
    triggerMouseClick(fixture, '#addInputData');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddInputDataComponent);
  });

  it('should open dialog with create form for knowledge source', () => {
    triggerMouseClick(fixture, '#addKnowledgeSource');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddKnowledgeSourceComponent);
  });

  it('should open dialog with create form for organization', () => {
    triggerMouseClick(fixture, '#addOrganization');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddOrganizationComponent);
  });

  it('should open dialog with create form for business objective', () => {
    triggerMouseClick(fixture, '#addBusinessObjective');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddBusinessObjectiveComponent);
  });

  it('should open dialog with create form for process', () => {
    triggerMouseClick(fixture, '#addProcess');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddProcessComponent);
  });

  it('should open dialog with create form for event', () => {
    triggerMouseClick(fixture, '#addEvent');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddEventComponent);
  });

  it('should open dialog with create form for system', () => {
    triggerMouseClick(fixture, '#addSystem');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddSystemComponent);
  });

  it('should open dialog with create form for implementation component', () => {
    triggerMouseClick(fixture, '#addImplementationComponent');
    expect(openDialog).toHaveBeenCalledWith(fromComponents.AddImplementationComponentComponent);
  });
});

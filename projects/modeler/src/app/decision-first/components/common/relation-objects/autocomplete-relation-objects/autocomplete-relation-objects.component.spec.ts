import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NbDialogService, NbThemeModule } from '@nebular/theme';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { blankPages } from 'core/models';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../../theme';
import { Decision } from '../../../../models/decision.model';
import { ObjectClassNames, ObjectRelationsNames } from '../../../../models/objects.model';
import { Process } from '../../../../models/process.model';
import * as fromRoot from '../../../../store';
import * as fromReducers from '../../../../store/reducers';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';
import { AddBusinessObjectiveComponent } from '../../../business-objective/add-business-objective/add-business-objective.component';
import { AddDecisionComponent } from '../../../decision/add-decision/add-decision.component';
import { AddEventComponent } from '../../../event/add-event/add-event.component';
import { AddImplementationComponentComponent } from '../../../implementation-component/add-implementation-component/add-implementation-component.component';
import { AddInputDataComponent } from '../../../input-data/add-input-data/add-input-data.component';
import { AddKnowledgeSourceComponent } from '../../../knowledge-source/add-knowledge-source/add-knowledge-source.component';
import { AddOrganizationComponent } from '../../../organization/add-organization/add-organization.component';
import { AddProcessComponent } from '../../../process/add-process/add-process.component';
import { AddSystemComponent } from '../../../system/add-system/add-system.component';
import { AutocompleteRelationObjectsComponent } from './autocomplete-relation-objects.component';

describe('AutocompleteRelationObjectsComponent', () => {
  let component: AutocompleteRelationObjectsComponent;
  let fixture: ComponentFixture<AutocompleteRelationObjectsComponent>;
  let store: Store<fromReducers.IDecisionFirstState>;
  let dispatch: jasmine.Spy;
  let nbDialogService: NbDialogService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteRelationObjectsComponent],
      imports: [
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        DmsThemeModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
      providers: [
        NbDialogService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    dispatch = spyOn(store, 'dispatch');

    nbDialogService = TestBed.get(NbDialogService);
    spyOn(nbDialogService, 'open');

    fixture = TestBed.createComponent(AutocompleteRelationObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('create object', () => {
    it('should open dialog to create decision', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.Decision;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddDecisionComponent);
    });

    it('should open dialog to create input data', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.InputData;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddInputDataComponent);
    });

    it('should open dialog to create knowledge source', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.KnowledgeSource;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddKnowledgeSourceComponent);
    });

    it('should open dialog to create organization', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.Organization;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddOrganizationComponent);
    });

    it('should open dialog to create business objective', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.BusinessObjective;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddBusinessObjectiveComponent);
    });

    it('should open dialog to create process', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.Process;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddProcessComponent);
    });

    it('should open dialog to create event', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.Event;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddEventComponent);
    });

    it('should open dialog to create system', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.System;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddSystemComponent);
    });

    it('should open dialog to create implementation component', () => {
      component.to = { id: 'toId'} as any;
      component.acceptType = ObjectClassNames.ImplementationComponent;
      triggerMouseClick(fixture, '.search-control');
      fixture.detectChanges();
      triggerMouseClick(fixture, '.add-object');
      expect(nbDialogService.open).toHaveBeenCalledWith(AddImplementationComponentComponent);
    });
  });

  it('should add relation object', () => {
    const decision = new Decision();
    decision.id = 'decision1';

    const process = new Process();
    process.id = 'process1';

    component.to = decision;
    component.acceptType = ObjectClassNames.Process;
    component.addAction = fromRoot.AddRelatedObjectToDecision as any;
    component.relationObjectsKey = ObjectRelationsNames.Processes;

    triggerMouseClick(fixture, '.search-control');

    dispatch.and.callThrough();
    store.dispatch(new fromRoot.LoadAutocompleteSearchListSuccess({
      results: [process],
      pagination: blankPages,
    }));

    fixture.detectChanges();

    triggerMouseClick(fixture, '#item-process1');

    expect(dispatch).toHaveBeenCalledWith(new fromRoot.AddRelatedObjectToDecision({
      sourceObject: decision,
      relatedObject: process,
      relationPath: component.relationObjectsKey,
    }));
  });

  describe('dfmObjectsList', () => {
    it('should return array if to is defined', () => {
      component.relationObjectsKey = ObjectRelationsNames.Decisions;
      component.to = {'decisions': [{}, {}] } as any;

      expect(component.dfmObjectsList.length).toEqual(2);
    });

    it('should return empty array if to is undefined', () => {
      delete component.to;

      expect(component.dfmObjectsList.length).toEqual(0);
    });
  });

  describe('dfmSingleObject', () => {
    it('should return null if to is undefined', () => {
      delete component.to;

      expect(component.dfmSingleObject).toEqual(null);
    });

    it('should return single object array if to is defined', () => {
      component.relationObjectsKey = ObjectRelationsNames.ParentOrganization;
      component.to = { 'parentOrganization': {} } as any;

      expect(component.dfmSingleObject).toEqual({} as any);
    });
  });

  describe('getSearchExcludeIds', () => {
    it('should return excludeIds for array', () => {
      component.relationObjectsKey = ObjectRelationsNames.Decisions;
      component.to = {id: 'id1', 'decisions': [{id: 'id2'}, {id: 'id3'}] } as any;
      let expected = `${component.to.id},`;
      expected = expected.concat(...component.to['decisions'].map((object) => `${object.id},`))

      expect(component.getSearchExcludeIds()).toEqual(expected);
    });

    it('should return excludeIds for single object', () => {
      component.relationObjectsKey = ObjectRelationsNames.ParentOrganization;
      component.to = {id: 'id1', 'parentOrganization': {id: 'id2'} } as any;
      let expected = `${component.to.id},`;
      expected = expected.concat(component.to['parentOrganization'].id)

      expect(component.getSearchExcludeIds()).toEqual(expected);
    });

    it('should return excludeIds for single object', () => {
      component.to = {id: 'id1', 'parentOrganization': {id: 'id2'}} as any;
      component.relationObjectsKey = ObjectRelationsNames.ParentOrganization;
      const expected = `${component.to.id},id2`;

      expect(component.getSearchExcludeIds()).toEqual(expected);
    });
  });

  describe('inputSearch', () => {
    it('should open autocomplete list', () => {
      component.to = { id: 'toId'} as any;
      const input = fixture.debugElement.query(By.css('.search-control')).nativeElement;
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));

      expect(component.isShowAutocompleteList).toBeTruthy();
    });
  });
});

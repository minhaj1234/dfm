import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Diagram } from '../../../models/diagram.model';
import { DiagramSidebarTabTypes } from '../../../models/goJsDiagram.model';
import * as fromModelerStore from '../../../store';
import { SetSelectedSidebarTabType } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { DiagramSideBarComponent } from './diagram-sidebar.component';

describe('DiagramSideBarComponent', () => {
  let component: DiagramSideBarComponent;
  let fixture: ComponentFixture<DiagramSideBarComponent>;
  let store: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiagramSideBarComponent,
        MockComponent({ selector: 'dfm-diagram-tabs-container', inputs: ['selectedTabType'], outputs: ['tabSelected']}),
        MockComponent({ selector: 'dfm-diagram-tab', inputs: ['title', 'titleIcon', 'contentTemplateRef', 'type', 'needDisplay']}),
        MockComponent({ selector: 'dfm-palettes-diagram-container', inputs: ['diagram', 'existingObjects']}),
        MockComponent({ selector: 'dfm-edit-diagram', inputs: ['editObject', 'isReadOnly']}),
        MockComponent({ selector: 'dfm-go-js-existing-objects-palette', inputs: ['existingObjects', 'isClosable']}),
        MockComponent({ selector: 'dfm-go-js-links-palette', inputs: ['diagram']}),
        MockComponent({ selector: 'dfm-go-js-add-object-palette', inputs: ['diagram']}),
      ],
      imports: [ 
        TranslateModule.forRoot(),
        TestStoreModule
       ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(DiagramSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isReadOnly', () => {
    it('should dispatch SetSelectedSidebarTabType if isReadOnly is true' , () => {
      component.diagram = {id: '12345'} as Diagram;

      component.isReadOnly = true;

      expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedSidebarTabType({id: '12345', selectedSidebarTabType: null}))
    });

    it('should not dispatch SetSelectedSidebarTabType if isReadOnly is not true' , () => {
      component.diagram = {id: '12345'} as Diagram;

      component.isReadOnly = false;

      expect(store.dispatch).not.toHaveBeenCalled()
    });
  });

  describe('onTabSelected', () => {
    it('should call toggle and dispatch SetSelectedSidebarTabType' , () => {
      component.diagram = {id: '12345'} as Diagram;
      spyOn(component.toggle, 'emit');

      component.onTabSelected(DiagramSidebarTabTypes.Tools);

      expect(component.toggle.emit).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedSidebarTabType({id: '12345', selectedSidebarTabType: DiagramSidebarTabTypes.Tools}));
    });
  });

  describe('needDisplayToolsTab', () => {
    [
      DiagramSidebarTabTypes.Tools,
      DiagramSidebarTabTypes.Objects,
      DiagramSidebarTabTypes.Links,
      DiagramSidebarTabTypes.NewObjects,
    ]
    .forEach((type) => {
      it(`should return true if type of tab is ${type}`, () => {
        expect(component.needDisplayToolsTab(type)).toBeTruthy();
      });
    });
  });

});

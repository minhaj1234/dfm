import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { RelationObjectsDisplayComponent } from '../../..';
import { DmsThemeModule } from '../../../../../theme';
import { Decision } from '../../../../models/decision.model';
import { Graphable } from '../../../../models/graphable.model';
import { KnowledgeSource } from '../../../../models/knowledgeSource.model';
import { ObjectRelationsNames } from '../../../../models/objects.model';
import { IDecisionFirstState } from '../../../../store/reducers';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';

class FakeAdd implements Action {
  readonly type = 'add';
  constructor(payload: { from: any; to: any }) {}
}

@Component({
  template: `
    <dfm-relation-objects-display
      #actual
      [addAction]="addAction"
      relationObjectsKey="requiresDecisions"
      [to]="to"
      [maxCount]="maxCount"
      acceptsType="Decision"
    >
    </dfm-relation-objects-display>
  `,
})
class TestHostComponent {
  to: any;
  maxCount = 9999;

  @ViewChild('actual', { static: false }) actual: RelationObjectsDisplayComponent;
  
  addAction = (payload) => new FakeAdd(payload);

  constructor() {
    const alreadyAdded = new Decision();
    alreadyAdded.id = 'alreadyAdded';

    const to = new Decision();
    to.id = 'to';
    to.requiresDecisions = [alreadyAdded];

    this.to = to;
  }
}

describe('RelationObjectsDisplayComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        RelationObjectsDisplayComponent,
        MockComponent({ selector: 'dfm-autocomplete-relation-objects', inputs: ['to', 'acceptType', 'addAction', 'relationObjectKey', 'relationObjectsKey'] }),
        MockComponent({ selector: 'dfm-relation-object-chip', inputs: ['dfmObject', 'removeAction', 'isReadOnly', 'to', 'relationObjectsKey'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        DmsThemeModule,
        TestStoreModule,
      ],
      providers: [],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.actual).toBeTruthy();
  });

  describe('isAddAllowed', () => {
    let toBeDropped: Graphable;
    beforeEach(() => {
      toBeDropped = new Decision();
      toBeDropped.id = 'toBeDropped';
    });

    it('returns true if the item is not already added, it is not the parent itself, the limit has not been reached, it is the right type and the actions are defined', () => {
      expect(component.actual.isAddAllowed(toBeDropped)).toBe(true);
    });

    it('returns false if the item is already added', () => {
      toBeDropped.id = 'alreadyAdded';

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(false);
    });

    it('returns false trying to add itself to itself', () => {
      toBeDropped.id = 'to';

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(false);
    });

    it('returns false if the limit has been reached', () => {
      component.maxCount = 1;
      fixture.detectChanges();

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(false);
    });

    it('returns false if it is the wrong type', () => {
      toBeDropped = new KnowledgeSource();
      toBeDropped.id = 'toBeDropped';

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(false);
    });

    it('returns false if the add action is not defined', () => {
      delete component.addAction;
      fixture.detectChanges();

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(false);
    });

    it('returns false if to is not defined for multiple objects', () => {
      delete component.to;
      fixture.detectChanges();

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(false);
    });

    it('returns true if to and relationObjectsKey is single object', () => {
      component.actual.relationObjectsKey = ObjectRelationsNames.ParentOrganization;
      component.actual.to[ObjectRelationsNames.ParentOrganization] = null;

      expect(component.actual.isAddAllowed(toBeDropped)).toBe(true);
    });
  });

  it('dispatches the add Action when relationObjectsKey is defined', () => {
    spyOn(store, 'dispatch');
    const draggedOnto = new Decision();
    draggedOnto.id = 'draggedOnto';

    component.actual.add(draggedOnto);

    expect(store.dispatch).toHaveBeenCalledWith(new FakeAdd({ from: draggedOnto, to: component.to }));
  });

  describe('dfmObjectsList', () => {
    it('should return array if to is defined', () => {
      expect(component.actual.dfmObjectsList.length).toEqual(1);
    });

    it('should return empty array if to is undefined', () => {
      delete component.actual.to;

      expect(component.actual.dfmObjectsList.length).toEqual(0);
    });
  });

  describe('dfmSingleObject', () => {
    it('should return null if to is undefined', () => {
      delete component.actual.to;

      expect(component.actual.dfmSingleObject).toEqual(null);
    });

    it('should return single object array if to is defined', () => {
      component.actual.relationObjectsKey = ObjectRelationsNames.ParentOrganization;
      component.actual.to = { 'parentOrganization': {} as any };

      expect(component.actual.dfmSingleObject).toEqual({} as any);
    });
  });
});

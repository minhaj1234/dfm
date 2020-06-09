import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Action, Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { DmsThemeModule } from '../../../../../theme';
import { Decision } from '../../../../models/decision.model';
import { AddTab } from '../../../../store';
import { IDecisionFirstState } from '../../../../store/reducers';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';
import { RelationObjectChipComponent } from './relation-object-chip.component';

class FakeRemove implements Action {
  readonly type = 'remove';
  constructor(payload: { 
    sourceObject: any,
    relatedObject: any,
    relationPath: string 
  }) {}
}

const alreadyAdded = new Decision();
alreadyAdded.id = 'alreadyAdded';

const to = new Decision();
to.id = 'to';
to.requiresDecisions = [alreadyAdded];

describe('RelationObjectChipComponent', () => {
  let component: RelationObjectChipComponent;
  let fixture: ComponentFixture<RelationObjectChipComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationObjectChipComponent ],
      imports: [
        DmsThemeModule,
        TestStoreModule,
      ],
    })
    .overrideComponent(RelationObjectChipComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationObjectChipComponent);
    component = fixture.componentInstance;
    component.to = to;
    component.dfmObject = alreadyAdded;
    component.removeAction = FakeRemove as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches the remove Action when the remove button is clicked', () => {
    spyOn(store, 'dispatch');
    const dfmObject = new Decision();
    dfmObject.id = 'dfmObjectId';
    fixture.detectChanges();

    fixture.debugElement
      .query(By.css('.eva-close-circle'))
      .triggerEventHandler('click', component.to.requiresDecisions[0]);

    expect(store.dispatch).toHaveBeenCalledWith(new FakeRemove({ sourceObject: dfmObject, relatedObject: component.to, relationPath: '' }));
  });

  it('should open new tab', () => {
    spyOn(store, 'dispatch');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.chip')).triggerEventHandler('dblclick', component.to.requiresDecisions[0]);

    expect(store.dispatch).toHaveBeenCalledWith(new AddTab({ id: 'alreadyAdded', type: ObjectTabType.Decision }));
  });

  describe('remove', () => {
    it('dispatches the remove Action when relationObjectsKey is defined', () => {
      spyOn(store, 'dispatch');
      const dfmObject = new Decision();
      dfmObject.id = 'dfmObjectId';

      component.remove(dfmObject);

      expect(store.dispatch).toHaveBeenCalledWith(new FakeRemove({ sourceObject: dfmObject, relatedObject: component.to, relationPath: '' }));
    })
  });

  it('does not show the remove button if the remove action is not set', () => {
    delete component.removeAction;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.eva-close-circle'))).toBeNull();
  });

  describe('isCanRemove', () => {
    it('should return false if read only', () => {
      component.isReadOnly = true;

      expect(component.isCanRemove()).toBeFalsy();
    });

    it('should return false if removeAction is undefined', () => {
      delete component.removeAction;

      expect(component.isCanRemove()).toBeFalsy();
    });
  });
});

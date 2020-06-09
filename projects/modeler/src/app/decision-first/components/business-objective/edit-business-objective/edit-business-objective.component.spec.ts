import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { BusinessObjective } from '../../../models/businessObjective.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditBusinessObjectiveComponent } from './edit-business-objective.component';

describe('EditBusinessObjectivesComponent', () => {
  let component: EditBusinessObjectiveComponent;
  let fixture: ComponentFixture<EditBusinessObjectiveComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const businessObjective = new BusinessObjective();
  businessObjective.id = 'businessObjective1';
  businessObjective.name = 'test-name';
  businessObjective.description = 'test-description';
  businessObjective.url = 'https://business-objective.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditBusinessObjectiveComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBusinessObjectiveComponent);
    component = fixture.componentInstance;
    component.editObject = businessObjective;

    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validated form', () => {
    component.formGroup.get('name').setValue('');
    expect(component.formGroup.invalid).toBeTruthy();
  });

  it('dispatches an UpdateBusinessObjective on value changes if the form is valid', fakeAsync(() => {
    component.editObject = businessObjective;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateBusinessObjective({
        businessObjective: {
          id: businessObjective.id,
          name: 'New Name',
          description: businessObjective.description,
          url: businessObjective.url,
          _links: businessObjective._links,
        },
        objectTagsUpdate: {
          tags: businessObjective.tags,
          name: 'New Name',
          description: businessObjective.description,
        }      
      }),
    );
  }));

  it('does nothing on changes if the form is invalid', fakeAsync(() => {
    component.formGroup.get('name').setValue('');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.count()).toEqual(0);
  }));

  describe('read only mode', () => {
    it('should enable form control', () => {
      component.isReadOnly = false;
      expect(component.formGroup.enabled).toBeTruthy();
    });

    it('should disable form control', () => {
      component.isReadOnly = true;
      expect(component.formGroup.disabled).toBeTruthy();
    });
  });
});

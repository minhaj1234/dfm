import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { System } from '../../../models/system.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditSystemComponent } from './edit-system.component';

describe('EditSystemComponent', () => {
  let component: EditSystemComponent;
  let fixture: ComponentFixture<EditSystemComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const system = new System();
  system.id = 'system1';
  system.name = 'test-name';
  system.description = 'test-description';
  system.url = 'https://system.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditSystemComponent,
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
    fixture = TestBed.createComponent(EditSystemComponent);
    component = fixture.componentInstance;
    component.editObject = system;

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

  it('dispatches an UpdateSystem on value changes if the form is valid', fakeAsync(() => {
    component.editObject = system;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateSystem({
        system: {
          id: system.id,
          name: 'New Name',
          description: system.description,
          url: system.url,
          _links: system._links,
        },
        objectTagsUpdate: {
          tags: system.tags,
          name: 'New Name',
          description: system.description,
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

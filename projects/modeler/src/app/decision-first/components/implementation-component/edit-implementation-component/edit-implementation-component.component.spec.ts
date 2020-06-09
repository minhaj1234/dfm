import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditImplementationComponentComponent } from './edit-implementation-component.component';

describe('EditImplementationComponentComponent', () => {
  let component: EditImplementationComponentComponent;
  let fixture: ComponentFixture<EditImplementationComponentComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const implementationComponent = new ImplementationComponent();
  implementationComponent.id = 'implementationComponent1';
  implementationComponent.name = 'test-name';
  implementationComponent.description = 'test-description';
  implementationComponent.url = 'https://implementation-component.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditImplementationComponentComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
        MockComponent({ selector: 'dfm-implementation-component-select-icon-container', inputs: ['objectId'] }),
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImplementationComponentComponent);
    component = fixture.componentInstance;
    component.editObject = implementationComponent;

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

  it('dispatches an UpdateImplementationComponent on value changes if the form is valid', fakeAsync(() => {
    component.editObject = implementationComponent;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateImplementationComponent({
        implementationComponent: {
          id: implementationComponent.id,
          name: 'New Name',
          description: implementationComponent.description,
          url: implementationComponent.url,
          _links: implementationComponent._links,
        },
        objectTagsUpdate: {
          tags: implementationComponent.tags,
          name: 'New Name',
          description: implementationComponent.description,
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

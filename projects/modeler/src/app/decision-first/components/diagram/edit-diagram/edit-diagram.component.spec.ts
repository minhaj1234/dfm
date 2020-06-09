import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { Diagram } from '../../../models/diagram.model';
import { UpdateDiagram } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditDiagramComponent } from './edit-diagram.component';

describe('EditDiagramComponent', () => {
  let component: EditDiagramComponent;
  let fixture: ComponentFixture<EditDiagramComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const diagram = new Diagram();
  diagram.id = 'diagramId';
  diagram.name = 'Diagram Name';
  diagram.description = 'Any interesting description';
  diagram._links = { self: { href: 'http://self' } } as any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditDiagramComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(EditDiagramComponent);
    component = fixture.componentInstance;
    component.editObject = diagram;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches an UpdateDiagram on value changes if the form is valid', fakeAsync(() => {
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new UpdateDiagram({
        diagram: {
          _links: diagram._links,
          description: diagram.description,
          id: diagram.id,
          name: 'New Name',
        },
        objectTagsUpdate: {
          tags: diagram.tags,
          name: 'New Name',
          description: diagram.description,
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

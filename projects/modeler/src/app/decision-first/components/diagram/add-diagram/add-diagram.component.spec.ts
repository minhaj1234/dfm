import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, NbDialogRefMock } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { DmsThemeModule } from './../../../../theme';
import { AddDiagramComponent } from './add-diagram.component';

describe('AddDiagramComponent', () => {
  let component: AddDiagramComponent;
  let fixture: ComponentFixture<AddDiagramComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddDiagramComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        NoopAnimationsModule,
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [NbDialogService, { provide: NbDialogRef, useClass: NbDialogRefMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(AddDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking on Add Diagram dispatches the Add Diagram Event', () => {
    const newDiagram = {
      description: 'test description',
      name: 'test name',
    };
    component.formGroup.setValue(newDiagram);
    const expectedAction = new fromModelerStore.AddDiagram({ ...newDiagram });
    triggerMouseClick(fixture, 'button');
    expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({ ...expectedAction });
  });

  it('clicking on Add Diagram does nothing if the form is invalid', () => {
    const newDiagram = {
      description: 'test description',
      name: '',
    };
    component.formGroup.setValue(newDiagram);
    triggerMouseClick(fixture, 'button');
    expect(dispatchModelerStore).not.toHaveBeenCalled();
  });
});

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
import { AddOrganizationComponent } from './add-organization.component';

describe('AddOrganizationComponent', () => {
  let component: AddOrganizationComponent;
  let fixture: ComponentFixture<AddOrganizationComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddOrganizationComponent,
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
    fixture = TestBed.createComponent(AddOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking on Add Organization dispatches the Add Organization Event', () => {
    const newOrganization = {
      name: 'test name',
      description: 'test description',
      type: 'ORGANIZATION',
      url: 'http://example.com',
    };
    component.formGroup.setValue(newOrganization);
    const expectedAction = new fromModelerStore.AddOrganization({ ...newOrganization });
    triggerMouseClick(fixture, '.add-organization');
    expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({ ...expectedAction });
  });

  it('should do not create organization if form invalid', () => {
    const organization = {
      name: null,
      description: 'test description',
      type: 'ROLE',
      url: 'test url'
    };

    component.formGroup.setValue(organization);

    triggerMouseClick(fixture, '.add-organization');

    expect(dispatchModelerStore).not.toHaveBeenCalled();
  });
});

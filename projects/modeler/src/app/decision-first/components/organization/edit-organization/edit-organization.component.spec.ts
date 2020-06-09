import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { DmsThemeModule } from '../../../../theme';
import { Organization } from '../../../models/organization.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditOrganizationComponent } from './edit-organization.component';

describe('EditOrganizationComponent', () => {
  let component: EditOrganizationComponent;
  let fixture: ComponentFixture<EditOrganizationComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const organization = new Organization();
  organization.id = 'organizationId';
  organization.name = 'Organization Name';
  organization.description = 'Any interesting description';
  organization.type = 'SEMI-STRUCTURED';
  organization.url = 'http://example.com';
  organization._links = { self: { href: 'http://self' } } as any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditOrganizationComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        DmsThemeModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationComponent);
    component = fixture.componentInstance;
    component.editObject = organization;

    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does nothing on changes if the form is invalid', fakeAsync(() => {
    component.formGroup.get('name').setValue('');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.count()).toEqual(0);
  }));

  it('dispatches an UpdateOrganization on value changes if the form is valid', fakeAsync(() => {
    component.editObject = organization;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateOrganization({
        organization: {
          id: organization.id,
          name: 'New Name',
          description: organization.description,
          type: organization.type,
          url: organization.url,
          _links: organization._links,
        },
        objectTagsUpdate: {
          tags: organization.tags,
          name: 'New Name',
          description: organization.description,
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

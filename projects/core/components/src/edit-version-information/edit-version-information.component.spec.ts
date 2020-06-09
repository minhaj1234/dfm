import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbSidebarService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { VersionInformation } from 'core/models/public_api';
import { rootActions, rootReducers } from 'core/root-store';
import { MockComponent } from 'core/testing'
import { TestStoreModule } from 'core/testing';
import { DEBOUNCE_TIME, EditVersionInformationComponent } from './edit-version-information.component';

describe('EditVersionInformationComponent', () => {
  let component: EditVersionInformationComponent;
  let fixture: ComponentFixture<EditVersionInformationComponent>;
  let store: Store<rootReducers.IState>;
  let dispatch: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditVersionInformationComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['maxTextLength'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
      providers: [NbSidebarService],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(EditVersionInformationComponent);
    component = fixture.componentInstance;

    dispatch = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('change value', () => {
    it('should dispatch UpdateVersionInformation action if form is valid', fakeAsync(() => {
      component.versionInformation = getTestVersionInformation();

      component.versionInformationForm.patchValue({
        information: 'new information',
      });

      tick(DEBOUNCE_TIME);      
      expect(dispatch).toHaveBeenCalledWith(new rootActions.UpdateVersionInformation({
        information: 'new information',
        supportLink: 'supportLink',
      }));
    }));
  });

  it('should not dispatch UpdateVersionInformation action if form is not valid', fakeAsync(() => {
    component.versionInformation = getTestVersionInformation();

    component.versionInformationForm.patchValue({
      information: '',
    });

    tick(DEBOUNCE_TIME);      
    expect(dispatch).not.toHaveBeenCalled();
  }));
});

function getTestVersionInformation(): VersionInformation {
  return {
    information: 'information',
    supportLink: 'supportLink'
  } as VersionInformation;
}

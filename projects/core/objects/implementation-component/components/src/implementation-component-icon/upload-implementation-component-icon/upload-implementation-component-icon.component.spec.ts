import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { UploadImplementationComponentIconRequest } from 'core/objects/implementation-component/models';
import * as fromImplementationConponentStore from 'core/objects/implementation-component/store';
import { MessageService } from 'core/services';
import { FakeMessageService, MockComponent, TestStoreModule } from 'core/testing';
import { UploadImplementationComponentIconComponent } from './upload-implementation-component-icon.component';

describe('UploadImplementationComponentIconComponent', () => {
  let component: UploadImplementationComponentIconComponent;
  let fixture: ComponentFixture<UploadImplementationComponentIconComponent>;
  let store: Store<fromImplementationConponentStore.DecisionFirstImplementationComponentsIconsState>;
  let dispatch: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadImplementationComponentIconComponent,
        MockComponent({ selector: 'core-upload-file', inputs: ['accept'] }, true),
      ],
      providers: [
        { provide: MessageService, useValue: new FakeMessageService() }
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImplementationComponentIconComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    dispatch = spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayForm', () => {
    it('should reset from if displayForm is false', () => {
      component.uploadIconForm.setValue(getTestFormValue());

      component.displayForm = false;

      expect(component.uploadIconForm.getRawValue()).toEqual({
        name: null,
        tooltip: null,
        icon: null,
      });
    });
  }); 

  describe('open upload', () => {
    it('should dispatch OpenUploadImplementationComponentsIconForm', () => {
      component.openUploadIconForm();

      expect(dispatch).toHaveBeenCalledWith(new fromImplementationConponentStore.OpenUploadImplementationComponentsIconForm());
    });
  }); 

  describe('close upload', () => {
    it('should dispatch CloseUploadImplementationComponentsIconForm', () => {
      component.closeUploadIconForm();

      expect(dispatch).toHaveBeenCalledWith(new fromImplementationConponentStore.CloseUploadImplementationComponentsIconForm());
    });
  }); 

  describe('dispatchImplementationComponentUploadIcon', () => {
    it('should dispatch UploadImplementationComponentsIcon', () => {
      component.uploadIconForm.setValue(getTestFormValue());

      component.dispatchImplementationComponentUploadIcon();

      expect(dispatch).toHaveBeenCalledWith(
        new fromImplementationConponentStore.UploadImplementationComponentsIcon(getTestFormValue())
      );
    });
  }); 

  describe('isFormValid', () => {
    it('should return true if form is valid', () => {
      component.uploadIconForm.setValue(getTestFormValue());

      const result = component.isFormValid();

      expect(result).toBeTruthy();
    });

    it('should return false if form is invalid', () => {
      component.uploadIconForm.setValue({
        ...getTestFormValue(),
        icon: null,
      });

      const result = component.isFormValid();

      expect(result).toBeFalsy();
    });
  }); 

  describe('form valueChanges', () => {
    it('should dispatch GenericImplementationComponentsIconsFailure if icon is not valid', () => {
      component.uploadIconForm.setValue({
        ...getTestFormValue(),
        icon: {type: ''} as File,
      });

      expect(dispatch).toHaveBeenCalledWith(
        new fromImplementationConponentStore.GenericImplementationComponentsIconsFailure(new Error('resources.onlySvgTypeAllowed'))
      );
    });

    it('should reset icon value if icon is not valid', () => {
      component.uploadIconForm.setValue({
        ...getTestFormValue(),
        icon: {type: ''} as File,
      });

      expect(component.uploadIconForm.getRawValue()).toEqual({
        ...getTestFormValue(),
        icon: null,
      });
    });
  }); 

  function getTestFormValue(): UploadImplementationComponentIconRequest {
    return {
      name: 'icon name',
      tooltip: 'icon tooltip',
      icon: {type: '/svg'} as File,
    };
  }
});

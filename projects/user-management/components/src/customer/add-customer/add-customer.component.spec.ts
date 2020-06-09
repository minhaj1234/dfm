import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbDialogRef, NbThemeModule } from '@nebular/theme';
import { Action, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { triggerMouseClick, MockComponent, NbDialogRefMock } from 'core/testing';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { AddCustomerComponent } from './add-customer.component';
import { DEFAULT_COUNT_SHIFT_MONTHS } from './constants';

class FakeAddCustomer implements Action {
  type = 'FakeAddCustomer';
  constructor(payload: {
    name: string,
    numberOfUsers: number,
    validDate: Date,
  }) { };
}

describe('AddCustomerComponent', () => {
  let component: AddCustomerComponent;
  let fixture: ComponentFixture<AddCustomerComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddCustomerComponent,
        MockComponent({ selector: 'core-date-time-picker', inputs: ['showTime'] }, true),
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        NbThemeModule.forRoot(),
        StoreModule.forRoot([]),
        NbCardModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: NbDialogRef, useClass: NbDialogRefMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(AddCustomerComponent);
    component = fixture.componentInstance;
    component.addAction = FakeAddCustomer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('click on Add customer button', () => {
    it('should dispatch Add Customer action if form is valid', () => {
      const newCustomer = {
        name: 'test name',
        numberOfUsers: 5,
        validDate: new Date,
        domains: 'domains.com',
      };
      component.formGroup.setValue(newCustomer);
      const expectedAction = new FakeAddCustomer(newCustomer);

      triggerMouseClick(fixture, 'button');

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should not dispatch Add Customer action if form is invalid', () => {
      const newCustomer = {
        name: null,
        numberOfUsers: 5,
        validDate: new Date,
        domains: 'domains.com',
      };
      component.formGroup.setValue(newCustomer);

      triggerMouseClick(fixture, 'button');

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('getDefaultValidDate', () => {
    it('should return current date shifted to the default counts of months', () => {
      const expected = new Date();
      expected.setMonth(expected.getMonth() + DEFAULT_COUNT_SHIFT_MONTHS)

      const result = component.getDefaultValidDate();

      expect(result).toEqual(expected);
    });
  });
});

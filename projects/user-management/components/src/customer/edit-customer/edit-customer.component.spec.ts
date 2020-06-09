import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Action, Store, StoreModule } from '@ngrx/store';
import { triggerMouseClick, FakeClipboardService, FakeToastrService, MockComponent } from 'core/testing';
import { ClipboardService } from 'ngx-clipboard';
import { Customer } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { EditCustomerComponent } from './edit-customer.component';

class FakeUpdateCustomer implements Action {
  type = 'FakeUpdateCustomer';
  constructor(payload: Partial<Customer>) { }
}

describe('EditCustomerComponent', () => {
  let component: EditCustomerComponent;
  let fixture: ComponentFixture<EditCustomerComponent>;
  let store: Store<IDecisionFirstState>;
  let toastrService: NbToastrService;
  let clipboardService: ClipboardService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditCustomerComponent,
        MockComponent({ selector: 'core-date-time-picker', inputs: ['showTime'] }, true),
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot([]),
      ],
      providers: [
        { provide: NbToastrService, useValue: new FakeToastrService() },
        { provide: ClipboardService, useValue: new FakeClipboardService() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    toastrService = TestBed.get(NbToastrService);
    clipboardService = TestBed.get(ClipboardService);
    spyOn(store, 'dispatch');
    spyOn(toastrService, 'success');
    spyOn(clipboardService, 'copyFromContent');
    fixture = TestBed.createComponent(EditCustomerComponent);
    component = fixture.componentInstance;
    component.updateAction = FakeUpdateCustomer;
    component.debounceTime = 100;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('change form value', () => {
    it('should dispatch Update Customer action if form is valid', fakeAsync(() => {
      component.editObject = getTestCustomer();
      const expected = getTestCustomer();
      expected.name = 'New Name';

      component.formGroup.get('name').setValue('New Name');

      tick(component.debounceTime);
      expect(store.dispatch).toHaveBeenCalledWith(new FakeUpdateCustomer(expected));
    }))

    it('should not dispatch Update Customer action if form is invalid', fakeAsync(() => {
      component.editObject = getTestCustomer();

      component.formGroup.get('name').setValue('');

      tick(component.debounceTime);
      expect(store.dispatch).not.toHaveBeenCalled();
    }))
  });

  describe('copyApiKey', () => {
    beforeEach(() => {
      component.editObject = getTestCustomer();

      triggerMouseClick(fixture, '.eva-copy-outline');
    });

    it('should call success of toastrService', () => {
      expect(toastrService.success).toHaveBeenCalledWith('ApiKey copied', 'Info message');
    });

    it('should call copyFromContent with api key', () => {
      const formApiKeyValue = component.formGroup.controls.apiKey.value;

      expect(clipboardService.copyFromContent).toHaveBeenCalledWith(formApiKeyValue);
    });
  });
});

function getTestCustomer(): Customer {
  const customer = new Customer();
  customer.id = '12345';
  customer.name = 'customer name';
  customer.description = 'customer descriptiion';
  customer.apiKey = '1234567890';
  customer.createdDate = new Date();
  customer.validDate = new Date();
  customer.numberOfUsers = 5;
  customer.footerHtml = '';
  customer.users = [];
  customer.groups = [];
  customer._links = { self: { href: 'http://self' } } as any;
  customer.domains = 'domains.com';

  return customer;
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { AdminContainerComponent } from './admin-container.component';

describe('AdminContainerComponent', () => {
  let component: AdminContainerComponent;
  let fixture: ComponentFixture<AdminContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminContainerComponent,
        MockComponent({ selector: 'dfm-admin-all-tags', inputs: ['tags'] }),
        MockComponent({ selector: 'user-management-edit-customer-container', inputs: ['customerId', 'options'] }),
      ],
      imports: [
        TranslateModule.forRoot(),
        DmsThemeModule,
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

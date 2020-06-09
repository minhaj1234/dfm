import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { PrintTabContainerComponent } from './print-tab-container.component';

describe('PrintContainerComponent', () => {
  let component: PrintTabContainerComponent;
  let fixture: ComponentFixture<PrintTabContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrintTabContainerComponent,
        MockComponent({ selector: 'dfm-print-container', inputs: ['objectId', 'objectType', 'customerFooter'] }),
      ],
      imports: [
        DmsThemeModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintTabContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

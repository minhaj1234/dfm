import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing'
import { PrintContainerComponent } from '..';
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';

describe('PrintContainerComponent', () => {
  let component: PrintContainerComponent;
  let fixture: ComponentFixture<PrintContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrintContainerComponent,
        MockComponent({ selector: 'dfm-print-diagram', inputs: ['diagram', 'includeRelatedObjects', 'image'] }),
        MockComponent({ selector: 'dfm-print-object', inputs: ['object', 'includeComments', 'includeRelatedObjects'] }),
      ],
      imports: [
        DmsThemeModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintContainerComponent);
    component = fixture.componentInstance;
    component.objectType = ObjectTabType.Decision;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

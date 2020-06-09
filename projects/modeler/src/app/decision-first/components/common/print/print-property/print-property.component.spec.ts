import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DmsThemeModule } from '../../../../../theme';
import { PrintPropertyComponent } from './print-property.component';

describe('PrintPropertyDisplayComponent', () => {
  let component: PrintPropertyComponent;
  let fixture: ComponentFixture<PrintPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrintPropertyComponent,
      ],
      imports: [
        DmsThemeModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

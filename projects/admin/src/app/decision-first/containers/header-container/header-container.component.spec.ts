import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbSidebarService, NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { HeaderContainerComponent } from './header-container.component';

describe('HeaderContainerComponent', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderContainerComponent,
        MockComponent({ selector: 'core-logo' }),
      ],
      imports: [
        NbThemeModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [NbSidebarService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

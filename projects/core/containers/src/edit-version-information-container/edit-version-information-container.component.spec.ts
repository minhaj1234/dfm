import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule, NbSidebarService, NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { TestStoreModule } from 'core/testing';
import { EditVersionInformationContainerComponent } from './edit-version-information-container.component';

describe('EditVersionInformationContainerComponent', () => {
  let component: EditVersionInformationContainerComponent;
  let fixture: ComponentFixture<EditVersionInformationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditVersionInformationContainerComponent,
        MockComponent({ selector: 'core-edit-version-information', inputs: ['versionInformation'] }),
      ],
      imports: [
        TestStoreModule,
        TranslateModule.forRoot(),
        NbCardModule,
      ],
      providers: [NbSidebarService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVersionInformationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

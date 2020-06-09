import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbDialogRef } from '@nebular/theme';
import { NbDialogRefMock, TestStoreModule } from 'core/testing';
import { AddObjectComponent } from './add-object.component';

describe('AddObjectComponent', () => {
  let component: AddObjectComponent;
  let fixture: ComponentFixture<AddObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddObjectComponent
      ],
      imports: [
        TestStoreModule,
      ],
      providers: [
        { provide: NbDialogRef, useClass: NbDialogRefMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

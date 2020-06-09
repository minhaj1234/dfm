import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { TestStoreModule } from 'core/testing';
import { EditObjectComponent } from './edit-object.component';

describe('EditObjectComponent', () => {
  let component: EditObjectComponent<any>;
  let fixture: ComponentFixture<EditObjectComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditObjectComponent
      ],
      imports: [
        TestStoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObjectComponent);
    component = fixture.componentInstance;
    component.editObject = {};
    component.isReadOnly = false;
    component.formGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

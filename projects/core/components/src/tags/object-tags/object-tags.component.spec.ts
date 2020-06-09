import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'core/testing';
import { ObjectTagsComponent } from './object-tags.component';

describe('ObjectTagsComponent', () => {
  let component: ObjectTagsComponent;
  let fixture: ComponentFixture<ObjectTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ObjectTagsComponent,
        MockComponent({ selector: 'core-tag', inputs: ['addTabAction', 'id', 'text', 'size'] }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

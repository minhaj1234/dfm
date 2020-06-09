import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { ITab, ObjectTabType } from 'core/models';
import { triggerMouseClick, TestStoreModule } from 'core/testing';
import { TagComponent } from './tag.component';

class FakeAddTab implements Action {
  readonly type = 'Fake Add Tab';
  constructor(public payload: ITab) { }
}

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;
  let store: Store<unknown>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagComponent
      ],
      imports: [
        TestStoreModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tab', () => {
    it('should open tab', () => {
      component.id = 'tag-id';
      component.addTabAction = FakeAddTab;
      fixture.detectChanges();
      triggerMouseClick(fixture, '.tag');

      expect(store.dispatch).toHaveBeenCalledWith(new component.addTabAction({
        id: 'tag-id',
        type: ObjectTabType.Tag,
      }));
    });

    it('should not open tab', () => {
      component.id = 'tag-id';
      fixture.detectChanges();
      triggerMouseClick(fixture, '.tag');

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});

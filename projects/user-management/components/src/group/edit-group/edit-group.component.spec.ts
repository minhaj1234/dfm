import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Action, Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'core/testing';
import { Group } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { EditGroupComponent } from './edit-group.component';

class FakeUpdateGroup implements Action {
  type = 'FakeUpdateGroup';
  constructor(payload: Partial<Group>) { }
}

describe('EditGroupComponent', () => {
  let component: EditGroupComponent;
  let fixture: ComponentFixture<EditGroupComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditGroupComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['tags'] }),
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot([]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(EditGroupComponent);
    component = fixture.componentInstance;
    component.updateAction = FakeUpdateGroup;
    component.debounceTime = 100;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('change form value', () => {
    it('should dispatch Update Group action if form is valid', fakeAsync(() => {
      component.editObject = getTestGroup();
      const expected = getTestGroup();
      expected.name = 'New Name';

      component.formGroup.get('name').setValue('New Name');

      tick(component.debounceTime);
      expect(store.dispatch).toHaveBeenCalledWith(new FakeUpdateGroup(expected));
    }))

    it('should not dispatch Update Group action if form is invalid', fakeAsync(() => {
      component.editObject = getTestGroup();

      component.formGroup.get('name').setValue('');

      tick(component.debounceTime);
      expect(store.dispatch).not.toHaveBeenCalled();
    }))
  });
});

function getTestGroup(): Group {
  const group = new Group();
  group.id = '12345';
  group.name = 'group name';
  group.description = 'group descriptiion';
  group.users = [];
  group._links = { self: { href: 'http://self' } } as any;

  return group;
}

import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogModule, NbDialogRef, NbDialogService, NbThemeModule } from '@nebular/theme';
import { Action, Store, StoreModule } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { getDebugElement, triggerMouseClick, MockComponent, NbDialogRefMock } from 'core/testing';
import { User, USER_NAMAGEMENT_CLASS_NAMES } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { UsersTableComponent } from './users-table.component';

class FakeAddTab implements Action {
  readonly type = 'addTab';
  constructor(payload: {id: string, type: ObjectTabType}) {}
}

class FakeAddUser implements Action {
  readonly type = 'addUser';
  constructor(payload: {}) {}
}

class FakeLoadUsersToAutocompleteSearchList implements Action {
  readonly type = 'ladUsersToAutocompleteSearchList';
  constructor(payload: {
    searchTerm: string,
    objectTypes: string[],
    pageSize: number,
    excludeIds: string,
  }) {}
}

class FakeSetAutocompleteSearchListInitialState implements Action {
  readonly type = 'setAutocompleteSearchListInitialStateA';
}

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  let store: Store<IDecisionFirstState>;
  let dialogService: NbDialogService;

  const users: User[] = [
    createTestUser('user1'),
    createTestUser('user2'),
    createTestUser('user3'),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UsersTableComponent,
        MockComponent({ 
          selector: 'core-autocomplete-list', 
          inputs: ['autocompleteSearchList', 'searchDebounceTime'],
          outputs: ['updateSearchList', 'selectListItem', 'resetSearchList'] 
        }),
      ],
      imports: [
        NoopAnimationsModule,
        NbThemeModule.forRoot(),
        StoreModule.forRoot([]),
        NbDialogModule.forRoot({autoFocus: false}),
      ],
      providers: [
        { provide: NbDialogRef, useClass: NbDialogRefMock }
      ],
    })
    .overrideComponent(UsersTableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    dialogService = TestBed.get(NbDialogService);
    spyOn(store, 'dispatch');
    spyOn(dialogService, 'open');
    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
    component.users= users;
    component.addTabAction = FakeAddTab;
    component.addUserAction = FakeAddUser;
    component.loadUsersToAutocompleteSearchListAction = FakeLoadUsersToAutocompleteSearchList;
    component.setAutocompleteSearchListInitialStateAction = FakeSetAutocompleteSearchListInitialState;
    component.autocompleteListPageSize = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Double click on user table row', () => {
    it('should dispatch addTabAction', () => {
      const rows = fixture.debugElement.queryAll(By.css('.user-row'));
      
      rows[0].triggerEventHandler('dblclick', new MouseEvent("dblclick"));

      expect(store.dispatch).toHaveBeenCalledWith(new FakeAddTab({
        id: users[0].id,
        type: ObjectTabType.User
      }));
    });
  });

  describe('Click on add user button', () => {
    it('should open dialog to create User', () => {
      triggerMouseClick(fixture, '.add-user-button');

      expect(dialogService.open).toHaveBeenCalled();
    });
  });

  describe('Add user button', () => {
    it('should be visible if addUserAction is defined', () => {
      const button = getDebugElement(fixture, '.add-user-button');

      expect(button).toBeTruthy();
    });

    it('should not be visible if addUserAction is undefined', () => {
      delete component.addUserAction;
      fixture.detectChanges();

      const button = getDebugElement(fixture, '.add-user-button');

      expect(button).toBeFalsy();
    });
  });

  describe('onSearchListUpdate', () => {
    it('should dispatch LoadUsersToAutocompleteSearchList', () => {
      component.onSearchListUpdate('search term');

      expect(store.dispatch).toHaveBeenCalledWith(new FakeLoadUsersToAutocompleteSearchList({
        searchTerm: 'search term',
        objectTypes: [USER_NAMAGEMENT_CLASS_NAMES.User],
        pageSize: component.autocompleteListPageSize,
        excludeIds: ['user1', 'user2', 'user3'].toString(),
      }));
    });
  });

  describe('onResetSearchList', () => {
    it('should dispatch SetAutocompleteSearchListInitialState', () => {
      component.onResetSearchList();

      expect(store.dispatch).toHaveBeenCalledWith(new FakeSetAutocompleteSearchListInitialState());
    });
  });

  function createTestUser(id: string): User {
    const user = new User();
    user.id = id;

    return user;
  }
});

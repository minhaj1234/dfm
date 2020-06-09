import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogModule, NbDialogRef, NbDialogService, NbThemeModule } from '@nebular/theme';
import { Action, Store, StoreModule } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { getDebugElement, triggerMouseClick, MockComponent, NbDialogRefMock } from 'core/testing';
import { Group, USER_NAMAGEMENT_CLASS_NAMES } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { GroupsTableComponent } from './groups-table.component';

class FakeAddTab implements Action {
  readonly type = 'addTab';
  constructor(payload: {id: string, type: ObjectTabType}) {}
}

class FakeAddGroup implements Action {
  readonly type = 'addGroup';
  constructor(payload: {}) {}
}


class FakeLoadGroupsToAutocompleteSearchList implements Action {
  readonly type = 'loadGroupsToAutocompleteSearchList';
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

describe('GroupsTableComponent', () => {
  let component: GroupsTableComponent;
  let fixture: ComponentFixture<GroupsTableComponent>;
  let store: Store<IDecisionFirstState>;
  let dialogService: NbDialogService;
  
  const groups: Group[] = [
    createTestGroup('group1'),
    createTestGroup('group2'),
    createTestGroup('group3'),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupsTableComponent,
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
    .overrideComponent(GroupsTableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    dialogService = TestBed.get(NbDialogService);
    spyOn(store, 'dispatch');
    spyOn(dialogService, 'open');
    fixture = TestBed.createComponent(GroupsTableComponent);
    component = fixture.componentInstance;
    component.groups = groups;
    component.addTabAction = FakeAddTab;
    component.addGroupAction = FakeAddGroup;
    component.setAutocompleteSearchListInitialStateAction = FakeSetAutocompleteSearchListInitialState;
    component.loadGroupsToAutocompleteSearchListAction = FakeLoadGroupsToAutocompleteSearchList;
    component.autocompleteListPageSize = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Double click on group table row', () => {
    it('should dispatch addTabAction', () => {
      const rows = fixture.debugElement.queryAll(By.css('.group-row'));
      
      rows[0].triggerEventHandler('dblclick', new MouseEvent("dblclick"));

      expect(store.dispatch).toHaveBeenCalledWith(new FakeAddTab({
        id: groups[0].id,
        type: ObjectTabType.Group
      }));
    });
  });

  describe('Click on add group button', () => {
    it('should open dialog to create Group', () => {
      triggerMouseClick(fixture, '.add-group-button');

      expect(dialogService.open).toHaveBeenCalled();
    });
  });

  describe('Add group button', () => {
    it('should be visible if addGroupAction is defined', () => {
      const button = getDebugElement(fixture, '.add-group-button');

      expect(button).toBeTruthy();
    });

    it('should not be visible if addGroupAction is undefined', () => {
      delete component.addGroupAction;
      fixture.detectChanges();

      const button = getDebugElement(fixture, '.add-group-button');

      expect(button).toBeFalsy();
    });
  });

  describe('onSearchListUpdate', () => {
    it('should dispatch LoadGroupsToAutocompleteSearchList', () => {
      component.onSearchListUpdate('search term');

      expect(store.dispatch).toHaveBeenCalledWith(new FakeLoadGroupsToAutocompleteSearchList({
        searchTerm: 'search term',
        objectTypes: [USER_NAMAGEMENT_CLASS_NAMES.Group],
        pageSize: component.autocompleteListPageSize,
        excludeIds: ['group1', 'group2', 'group3'].toString(),
      }));
    });
  });

  describe('onResetSearchList', () => {
    it('should dispatch SetAutocompleteSearchListInitialState', () => {
      component.onResetSearchList();

      expect(store.dispatch).toHaveBeenCalledWith(new FakeSetAutocompleteSearchListInitialState());
    });
  });

  function createTestGroup(id: string): Group {
    const group = new Group();
    group.id = id;

    return group;
  }
});

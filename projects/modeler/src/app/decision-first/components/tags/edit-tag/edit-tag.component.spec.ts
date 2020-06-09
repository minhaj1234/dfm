import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { Decision } from '../../../models/decision.model';
import { ObjectClassNames } from '../../../models/objects.model';
import { Tag } from '../../../models/tag.model';
import * as fromModelerStore from '../../../store';
import { IDecisionFirstState } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditTagComponent } from './edit-tag.component';

describe('EditTagComponent', () => {
  let component: EditTagComponent;
  let fixture: ComponentFixture<EditTagComponent>;
  let modelerStore: Store<IDecisionFirstState>;

  const decision = new Decision();
  decision.id = 'decision-id';

  const tag = createTestTag();
  tag.decisions = [decision];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditTagComponent,
        MockComponent({ 
          selector: 'core-autocomplete-list', 
          inputs: ['autocompleteSearchList', 'searchDebounceTime'],
          outputs: ['updateSearchList', 'selectListItem', 'resetSearchList'] 
        }),
      ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(EditTagComponent);
    component = fixture.componentInstance;
    component.tag = tag;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  describe('canMerge', () => {
    it('should return true if mergingTargetTag exists', () => {
      component.onTagSelected({id: 'selectedTagId'} as Tag);

      const tagCanBeMerged = component.canMerge(); 

      expect(tagCanBeMerged).toBeTruthy();
    });
  });

  describe('onDeleteClicked', () => {
    it('should dispatch DeleteTag', () => {
      component.tag = {id: '12345'} as Tag;

      component.onDeleteClicked();

      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.DeleteTag({id: '12345'} as Tag));
    });
  });

  describe('onRenameClicked', () => {
    it('should dispatch UpdateTag', () => {
      component.tagName = 'newName';
      
      component.onRenameClicked();

      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.UpdateTag({
        tag: {
          id: tag.id,_links: tag._links, name: 'newName'
        }
      }));
    });
  });

  describe('onMergeClicked', () => {
    it('should dispatch MergeTags', () => {
      component.tag = tag;
      component.onTagSelected({id: 'selectedTagId'} as Tag);

      component.onMergeClicked();

      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.MergeTags({
        sourceTagId: 'selectedTagId',
        relatedTagId: tag.id,
      }));
    });
  });

  describe('onSearchListUpdate', () => {
    it('should dispatch UpdateSearchForAutocompleteSearchList', () => {
      component.onSearchListUpdate('search term');

      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.UpdateSearchForAutocompleteSearchList({
        searchTerm: 'search term',
        objectTypes: [ObjectClassNames.Tag],
        pageSize: Config.pageSize,
        excludeIds: '12345',
        fullMatchOnly: false,
      }));
    });
  });

  describe('onResetSearchList', () => {
    it('should dispatch SetAutocompleteSearchListInitialState', () => {
      component.onResetSearchList();

      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.SetAutocompleteSearchListInitialState());
    });
  });

  function createTestTag(): Tag {
    const newTag = new Tag();
    newTag._links = {
      self: {
        href: 'http//'
      }
    };
    newTag.id = '12345';
    newTag.name = 'name';
    return newTag;
  }
});

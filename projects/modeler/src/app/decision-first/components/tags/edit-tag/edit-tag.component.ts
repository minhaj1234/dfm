import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AutocompleteListItem } from 'core/models';
import { getI18nString } from 'core/utilities';
import { Observable } from 'rxjs';
import * as XRegExp from 'xregexp';
import { Config } from '../../../../config';
import { ObjectClassNames } from '../../../models/objects.model';
import { Tag } from '../../../models/tag.model';
import * as fromModelerStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
  geti18nObjectRelationName = getI18nString;
  tagName: string;
  config = Config;
  fromModelerStore = fromModelerStore;
  autocompleteSearchList$: Observable<AutocompleteListItem[]>;
  private mergingTargetTag: Tag;
  private _tag: Tag;
  @Input() set tag(tag: Tag) {
    if (tag) {
      this._tag = tag;
      this.tagName = tag.name;
    }
  };

  get tag(): Tag {
    return this._tag;
  };

  get excludeIds(): string[] {
    return this.tag ? [this.tag.id] : [];
  }

  get objectTypes(): string[]{
    return [ObjectClassNames.Tag];
  }
 
  constructor(
    private store: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.autocompleteSearchList$ = this.store.pipe(select(fromModelerStore.getAutocompleteSearchList));
  }

  onTagSelected(tag: Tag): void {
    this.mergingTargetTag = tag;
  }

  canRename(): boolean {
    return this.tagName.trim() !== this.tag.name && this.isValidTagName(this.tagName.trim());
  }

  isValidTagName(name: string): boolean {
    const regex = XRegExp('^#[\\pL\\pN]+$');

    return regex.test(name);
  }

  canMerge(): boolean {
    return !!this.mergingTargetTag;
  }
  
  onDeleteClicked(): void {
    this.store.dispatch(new fromModelerStore.DeleteTag(this.tag));
  }

  onRenameClicked(): void {
    this.store.dispatch(new fromModelerStore.UpdateTag({
      tag: {id: this.tag.id, _links: this.tag._links, name: this.tagName.trim()}
    }));
  }

  onMergeClicked(): void {
    this.store.dispatch(new fromModelerStore.MergeTags({sourceTagId: this.mergingTargetTag.id, relatedTagId: this.tag.id}));
  }

  onSearchListUpdate(searchTerm: string) {
    this.store.dispatch(new fromModelerStore.UpdateSearchForAutocompleteSearchList({
      searchTerm: searchTerm,
      objectTypes: [ObjectClassNames.Tag],
      pageSize: Config.pageSize,
      excludeIds: this.excludeIds.toString(),
      fullMatchOnly: false,
    }));
  }

  onResetSearchList() {
    this.store.dispatch(new fromModelerStore.SetAutocompleteSearchListInitialState());
  }
}

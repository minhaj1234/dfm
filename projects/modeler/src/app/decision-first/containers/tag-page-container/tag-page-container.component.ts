import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Tag } from '../../models/tag.model';
import * as fromModelerStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-tag-page-container',
  templateUrl: './tag-page-container.component.html',
  styleUrls: ['./tag-page-container.component.scss']
})
export class TagPageContainerComponent implements OnInit, OnDestroy {
  @Input() tagId: string;

  tag$: Observable<Tag>;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.modelerStore.dispatch(new fromModelerStore.LoadTag(this.tagId));

    this.tag$ = this.modelerStore.pipe(select(fromModelerStore.getSelectedTag(this.tagId)));
  }

  ngOnDestroy() {
    this.modelerStore.dispatch(new fromModelerStore.RemoveTagFromLocalMemory(this.tagId));
  }
}

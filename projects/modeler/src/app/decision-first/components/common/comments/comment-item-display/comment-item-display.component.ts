import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticatedUser, ObjectTabType } from 'core/models';
import { rootActions } from 'core/root-store';
import { UserType } from 'user-management/models';
import { Comment } from '../../../../models/comment.model';
import { CommentedDfmObjects, ObjectRelationsNames } from '../../../../models/objects.model';
import * as fromModelerStore from '../../../../store';
import { DEFAULT_USER_ICON_URL } from './comment-item-display.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-comment-item-display',
  templateUrl: './comment-item-display.component.html',
  styleUrls: ['./comment-item-display.component.scss']
})
export class CommentItemDisplayComponent implements OnInit {
  replyEditorOpen = false;
  iconUrl = DEFAULT_USER_ICON_URL;
  @Input() comment: Comment
  @Input() object: CommentedDfmObjects;
  @Input() addAction: rootActions.AddRelatedObjectAction;
  @Input() removeAction: rootActions.RemoveRelatedObjectAction;
  @Input() isReadOnly: boolean;
  @Input() authenticatedUser: AuthenticatedUser;
  @Input() displayForPrinting = false;
  @ViewChild('divComment', { static: false }) divComment: ElementRef;

  constructor(private modelerStore: Store<fromModelerStore.IDecisionFirstState>) {}

  ngOnInit() { }

  reply(): void {
    this.replyEditorOpen = !this.replyEditorOpen;
    this.scrollToReplyedComment();
  }

  scrollToReplyedComment(): void {
    if(this.divComment && this.replyEditorOpen) {
      setTimeout(() => this.divComment.nativeElement.scrollIntoView());
    }
  }

  deleteComment(comment: Comment): void {
    this.modelerStore.dispatch(new this.removeAction({sourceObject: this.object, relatedObject: comment, relationPath: ObjectRelationsNames.Comments}));
  }

  onUserNameClick(): void {
    this.modelerStore.dispatch(new fromModelerStore.AddTab({
      type: ObjectTabType.User,
      id: this.comment.user.id
    }));
  }

  canDelete(): boolean {
    return this.authenticatedUser 
    && (this.authenticatedUser.userType === UserType.ADMIN || this.comment.user.id === this.authenticatedUser.userId);
  }

  canReply(): boolean {
    return !this.isReadOnly && !this.comment.isDeleted && !this.displayForPrinting;
  }

  doDisplayIcon() {
    return !this.comment.isDeleted && !this.displayForPrinting
  }
}

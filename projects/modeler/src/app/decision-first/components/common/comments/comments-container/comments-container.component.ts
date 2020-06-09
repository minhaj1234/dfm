import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AuthenticatedUser } from 'core/models';
import { rootActions } from 'core/root-store';
import { UserType } from 'user-management/models';
import { Comment } from '../../../../models/comment.model';
import { CommentedDfmObjects } from '../../../../models/objects.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.scss']
})
export class CommentsContainerComponent {
  @Input() comments: Comment[];
  @Input() object: CommentedDfmObjects;
  @Input() addAction: rootActions.AddRelatedObjectAction;
  @Input() removeAction: rootActions.RemoveRelatedObjectAction;
  @Input() isReadOnly: boolean;
  @Input() authenticatedUser: AuthenticatedUser;
}

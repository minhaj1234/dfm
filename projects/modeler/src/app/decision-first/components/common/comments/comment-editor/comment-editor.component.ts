import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaxTextLengthCategory } from 'core/components';
import { rootActions } from 'core/root-store';
import { Comment } from '../../../../models/comment.model';
import { CommentedDfmObjects, ObjectRelationsNames } from '../../../../models/objects.model';
import * as fromModelerStore from '../../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-comment-editor',
  templateUrl: './comment-editor.component.html',
  styleUrls: ['./comment-editor.component.scss']
})
export class CommentEditorComponent implements OnInit {
  maxTextLengthCategory = MaxTextLengthCategory;
  commentForm: FormGroup;
  @Input() object: CommentedDfmObjects;
  @Input() repliedCommentId: string;
  @Input() addAction: rootActions.AddRelatedObjectAction;
  @Input() isReadOnly: boolean;

  constructor(private modelerStore: Store<fromModelerStore.IDecisionFirstState>) {}

  ngOnInit() {
    this.createCommentForm();
  }

  createCommentForm(): void {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    });
  }

  sendComment(): void {
    const comment = new Comment();
    comment.text = this.commentForm.value.comment;
    comment.parentCommentId = this.repliedCommentId;

    this.modelerStore.dispatch(new this.addAction({sourceObject: this.object, relatedObject: comment, relationPath: ObjectRelationsNames.Comments}));
    this.cleanForm();
  }

  cleanForm(): void {
    this.commentForm.reset();
    this.commentForm.markAsUntouched();
    this.commentForm.markAsPristine();
  }
}

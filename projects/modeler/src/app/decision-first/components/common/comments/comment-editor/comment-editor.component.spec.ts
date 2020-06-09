import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Comment } from '../../../../models/comment.model';
import { Decision } from '../../../../models/decision.model';
import { ObjectRelationsNames } from '../../../../models/objects.model';
import { IDecisionFirstState } from '../../../../store';
import * as fromModelerStore from '../../../../store';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';
import { CommentEditorComponent } from './comment-editor.component';

describe('CommentEditorComponent', () => {
  let component: CommentEditorComponent;
  let fixture: ComponentFixture<CommentEditorComponent>;
  let modelerStore: Store<IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommentEditorComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'maxTextLength'] }, true),
      ],
      imports: [
        TestStoreModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(CommentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sendComment', () => {
   it('should dispatch action', () => {
    const object = {id: 'objectId'} as Decision;
    const comment = new Comment();
    comment.text = 'text';
    comment.parentCommentId = 'parentCommentId';
    component.addAction = fromModelerStore.AddRelatedObjectToDecision as any;
    component.repliedCommentId = comment.parentCommentId;
    component.object = object;
    component.commentForm.setValue({comment: comment.text});

    component.sendComment();

    expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.AddRelatedObjectToDecision({
      sourceObject: object, 
      relatedObject: comment,
      relationPath: ObjectRelationsNames.Comments,
    }));
   });
  });
});

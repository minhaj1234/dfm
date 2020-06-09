import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticatedUser, ObjectTabType } from 'core/models';
import { getDebugElement, MockComponent } from 'core/testing';
import {  User, UserType } from 'user-management/models';
import { Comment } from '../../../../models/comment.model';
import { Decision } from '../../../../models/decision.model';
import { ObjectRelationsNames } from '../../../../models/objects.model';
import { IDecisionFirstState } from '../../../../store';
import * as fromModelerStore from '../../../../store';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';
import { CommentItemDisplayComponent } from './comment-item-display.component';

describe('CommentItemDisplayComponent', () => {
  let component: CommentItemDisplayComponent;
  let fixture: ComponentFixture<CommentItemDisplayComponent>;
  let modelerStore: Store<IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommentItemDisplayComponent,
        MockComponent({ selector: 'dfm-comment-editor', inputs: ['addAction', 'repliedCommentId', 'object'] }),
       ],
       imports: [
         TestStoreModule,
         TranslateModule.forRoot(),
        ]
    })
    .overrideComponent(CommentItemDisplayComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(CommentItemDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteComment', () => {
    it('should dispatch action', () => {
      const object = {id: 'objectId'} as Decision;
      component.removeAction = fromModelerStore.RemoveRelatedObjectFromDecision as any;
      component.object = object;
      const comment = new Comment();
      comment.id = 'commentId';

      component.deleteComment(comment);

      expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.RemoveRelatedObjectFromDecision({
        sourceObject: object, 
        relatedObject: comment,
        relationPath: ObjectRelationsNames.Comments,
      }));
    });
  });

  describe('reply', () => {
    it('should toggle replyEditorOpen', () => {
      component.replyEditorOpen = false;

      component.reply();

      expect(component.replyEditorOpen).toBeTruthy();
    });
  });

  describe('onUserNameClick', () => {
    it('should dispatch AddTab', () => {
      component.comment = getTestComment();

      component.onUserNameClick();

      expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.AddTab({
        type: ObjectTabType.User,
        id: 'userId',
      }));    
    });
  });

  describe('canDelete', () => {
    it('should return true if current user is Admin', () => {
      component.authenticatedUser = {  userType: UserType.ADMIN } as AuthenticatedUser

      const canDelete = component.canDelete();

      expect(canDelete).toBeTruthy();
    });

    it('should return true if current user id is equal to user id', () => {
      component.authenticatedUser = { userId: 'userId' } as AuthenticatedUser
      component.comment = getTestComment();
      
      const canDelete = component.canDelete();

      expect(canDelete).toBeTruthy();
    });

    it('should return false if current user is not admin and id is not equal to user id', () => {
      component.authenticatedUser = { userId: 'newUserId', userType: UserType.STANDARD } as AuthenticatedUser
      component.comment = getTestComment();
      
      const canDelete = component.canDelete();

      expect(canDelete).toBeFalsy();
    });
  });

  describe('display replay link', () => {
    it('should display if canReply return true', () => {
      component.comment = getTestComment();
      component.isReadOnly = false;
      fixture.detectChanges();

      const element = getDebugElement(fixture, '.comment-footer');

      expect(element).toBeTruthy();
    });

    it('should not display if canReply return false', () => {
      component.comment = getTestComment();
      component.isReadOnly = true;
      fixture.detectChanges();

      const element = getDebugElement(fixture, '.comment-footer');

      expect(element).toBeFalsy();
    });
  });

  describe('canReply', () => {
    it('should return false if isReadOnly is true', () => {
      component.comment = getTestComment();
      component.isReadOnly = true;

      const result = component.canReply();

      expect(result).toBeFalsy();
    });

    it('should return false if coment is deleted', () => {
      component.comment = getTestComment();
      component.comment.isDeleted = true;

      const result = component.canReply();

      expect(result).toBeFalsy();
    });

    it('should return false if displayForPrinting is true', () => {
      component.comment = getTestComment();
      component.displayForPrinting = true;

      const result = component.canReply();

      expect(result).toBeFalsy();
    });

    it('should return true', () => {
      component.comment = getTestComment();

      const result = component.canReply();

      expect(result).toBeTruthy();
    });
  });


  function getTestComment(): Comment {
    const comment = new Comment();
    comment.user = { id: 'userId'} as User;

    return comment;
  }
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { CommentsContainerComponent } from './comments-container.component';

describe('CommentsContainerComponent', () => {
  let component: CommentsContainerComponent;
  let fixture: ComponentFixture<CommentsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommentsContainerComponent,
        MockComponent({ selector: 'dfm-comment-item-display', inputs: ['addAction', 'removeAction', 'object', 'comment', 'isReadOnly', 'authenticatedUser'] }),
        MockComponent({ selector: 'dfm-comment-editor', inputs: ['addAction', 'object'] }),
       ],
       imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

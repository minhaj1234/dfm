import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { Decision } from '../../../models/decision.model';
import { Tag } from '../../../models/tag.model';
import * as fromModelerStore from '../../../store';
import { IDecisionFirstState } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { TagAssociatedObjectsDisplayComponent } from './tag-associated-objects-display.component';

describe('TagAssociatedObjectsDisplayComponent', () => {
  let component: TagAssociatedObjectsDisplayComponent;
  let fixture: ComponentFixture<TagAssociatedObjectsDisplayComponent>;
  let modelerStore: Store<IDecisionFirstState>;

  const decision = new Decision();
  decision.id = 'decision-id';

  const tag = createTestTag();
  tag.decisions = [decision];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagAssociatedObjectsDisplayComponent,
        MockComponent({ selector: 'core-tag', inputs: ['id', 'text', 'size'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
        MockComponent({ selector: 'dfm-tag-entity-display', inputs: ['entity'] }),
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

    fixture = TestBed.createComponent(TagAssociatedObjectsDisplayComponent);
    component = fixture.componentInstance;
    component.tag = tag;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

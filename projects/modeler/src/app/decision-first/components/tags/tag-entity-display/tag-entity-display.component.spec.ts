import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { Decision } from '../../../models/decision.model';
import * as fromModelerStore from '../../../store';
import { IDecisionFirstState } from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { TagEntityDisplayComponent } from './tag-entity-display.component';

describe('TagEntityDisplayComponent', () => {
  let component: TagEntityDisplayComponent;
  let fixture: ComponentFixture<TagEntityDisplayComponent>;
  let modelerStore: Store<IDecisionFirstState>;

  const decision = new Decision();
  decision.id = 'decision-id';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagEntityDisplayComponent,
        MockComponent({ selector: 'core-tag', inputs: ['id', 'text', 'size'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
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

    fixture = TestBed.createComponent(TagEntityDisplayComponent);
    component = fixture.componentInstance;
    component.entity = decision;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('object tab', () => {
    it('should open object tab', () => {
      triggerMouseClick(fixture, '#tag-entity-decision-id');
      
      expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddTab({
        id: 'decision-id',
        type: ObjectTabType.Decision,
      }));
    });
  });
});
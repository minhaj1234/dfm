import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../../theme';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { KnowledgeSourcesListComponent } from './knowledge-sources-list.component';

describe('KnowledgeSourcesListComponent', () => {
  let component: KnowledgeSourcesListComponent;
  let fixture: ComponentFixture<KnowledgeSourcesListComponent>;
  const knowledgeSource1 = new KnowledgeSource();
  knowledgeSource1.id = 'knowledgeSource1';
  const knowledgeSource2 = new KnowledgeSource();
  knowledgeSource2.id = 'knowledgeSource2';
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        KnowledgeSourcesListComponent,
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
        MockComponent({ selector: 'dfm-search-list-item', inputs: ['searchItem', 'isReadOnly', 'type'] }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        DmsThemeModule,
        NbThemeModule.forRoot(),
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(KnowledgeSourcesListComponent);
    component = fixture.componentInstance;
    component.objectsList = [knowledgeSource1, knowledgeSource2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

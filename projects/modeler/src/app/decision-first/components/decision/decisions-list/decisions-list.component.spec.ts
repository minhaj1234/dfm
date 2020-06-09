import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../../theme';
import { Decision } from '../../../models/decision.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { DecisionsListComponent } from './decisions-list.component';

describe('DecisionsListComponent', () => {
  let component: DecisionsListComponent;
  let fixture: ComponentFixture<DecisionsListComponent>;
  const decision1 = new Decision();
  decision1.id = 'decision1';
  const decision2 = new Decision();
  decision2.id = 'decision2';
  let dispatch: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecisionsListComponent,
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
        MockComponent({ selector: 'dfm-search-list-item', inputs: ['searchItem', 'isReadOnly', 'type'] }),
      ],
      imports: [
        FormsModule,
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
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
    const store = TestBed.get(Store);
    dispatch = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(DecisionsListComponent);
    component = fixture.componentInstance;
    component.objectsList = [decision1, decision2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

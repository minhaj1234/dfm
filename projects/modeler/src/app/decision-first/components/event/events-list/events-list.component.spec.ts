import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../../theme';
import { Event } from '../../../models/events.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EventsListComponent } from './events-list.component';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const event1 = new Event();
  event1.id = 'event1';
  const event2 = new Event();
  event2.id = 'event2';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventsListComponent,
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
        MockComponent({ selector: 'dfm-search-list-item', inputs: ['searchItem', 'isReadOnly', 'type'] }),
      ],
      imports: [
        DmsThemeModule,
        NgDragDropModule.forRoot(),
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    component.objectsList = [event1, event2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

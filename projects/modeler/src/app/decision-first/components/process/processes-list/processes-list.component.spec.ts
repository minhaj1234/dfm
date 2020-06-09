import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { Process } from './../../../models/process.model';
import { ProcessesListComponent } from './processes-list.component';

describe('ProcessesListComponent', () => {
  let component: ProcessesListComponent;
  let fixture: ComponentFixture<ProcessesListComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const process1 = new Process();
  process1.id = 'process1';
  const process2 = new Process();
  process2.id = 'process2';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProcessesListComponent,
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
    fixture = TestBed.createComponent(ProcessesListComponent);
    component = fixture.componentInstance;
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    component.objectsList = [process1, process2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

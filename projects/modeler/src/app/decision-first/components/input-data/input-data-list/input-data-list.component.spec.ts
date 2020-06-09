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
import { InputData } from './../../../models/inputData.model';
import { InputDataListComponent } from './input-data-list.component';

describe('InputDataListComponent', () => {
  let component: InputDataListComponent;
  let fixture: ComponentFixture<InputDataListComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const inputData1 = new InputData();
  inputData1.id = 'inputData1';
  const inputData2 = new InputData();
  inputData2.id = 'inputData2';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputDataListComponent,
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
    fixture = TestBed.createComponent(InputDataListComponent);
    component = fixture.componentInstance;
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    component.objectsList = [inputData1, inputData2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

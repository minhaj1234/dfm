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
import { BusinessObjective } from './../../../models/businessObjective.model';
import { BusinessObjectivesListComponent } from './business-objectives-list.component';

describe('BusinessObjectivesListComponent', () => {
  let component: BusinessObjectivesListComponent;
  let fixture: ComponentFixture<BusinessObjectivesListComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const businessObjective1 = new BusinessObjective();
  businessObjective1.id = 'businessObjective1';
  const businessObjective2 = new BusinessObjective();
  businessObjective2.id = 'businessObjective2';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BusinessObjectivesListComponent,
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
    fixture = TestBed.createComponent(BusinessObjectivesListComponent);
    component = fixture.componentInstance;
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    component.objectsList = [businessObjective1, businessObjective2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

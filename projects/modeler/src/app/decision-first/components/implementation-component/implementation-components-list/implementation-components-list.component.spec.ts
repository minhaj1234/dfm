import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { DmsThemeModule } from '../../../../theme';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { ImplementationComponentsListComponent } from './implementation-components-list.component';

describe('ImplementationComponentsListComponent', () => {
  let component: ImplementationComponentsListComponent;
  let fixture: ComponentFixture<ImplementationComponentsListComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const implementationComponent1 = new ImplementationComponent();
  implementationComponent1.id = 'implementationComponent1';
  const implementationComponent2 = new ImplementationComponent();
  implementationComponent2.id = 'implementationComponent2';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImplementationComponentsListComponent,
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
    fixture = TestBed.createComponent(ImplementationComponentsListComponent);
    component = fixture.componentInstance;
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    component.objectsList = [implementationComponent1, implementationComponent2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

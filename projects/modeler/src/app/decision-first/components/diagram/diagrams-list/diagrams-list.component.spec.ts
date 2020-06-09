import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { Diagram } from '../../../models/diagram.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { DiagramsListComponent } from './diagrams-list.component';

describe('DiagramsListComponent', () => {
  let component: DiagramsListComponent;
  let fixture: ComponentFixture<DiagramsListComponent>;
  const diagram1 = new Diagram();
  diagram1.id = 'diagram1';
  const diagram2 = new Diagram();
  diagram2.id = 'diagram2';
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiagramsListComponent,
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
        MockComponent({ selector: 'dfm-preview-container', inputs: ['to'] }),
        MockComponent({ selector: 'dfm-search-list-item', inputs: ['searchItem', 'isReadOnly', 'type'] }),
      ],
      imports: [
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
    fixture = TestBed.createComponent(DiagramsListComponent);
    component = fixture.componentInstance;
    component.objectsList = [diagram1, diagram2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

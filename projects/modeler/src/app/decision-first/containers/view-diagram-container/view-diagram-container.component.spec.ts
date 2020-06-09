import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { ViewDiagramContainerComponent } from './view-diagram-container.component';

describe('ViewDiagramContainerComponent', () => {
  let component: ViewDiagramContainerComponent;
  let fixture: ComponentFixture<ViewDiagramContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewDiagramContainerComponent,
        MockComponent({ selector: 'dfm-diagram-sidebar', inputs: ['diagram', 'existingObjects', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-go-js-display-diagram', inputs: ['diagram', 'resizingDiagram', 'isReadOnly', 'icons']}),
        MockComponent({ selector: 'dfm-panel-info-diagram-container', inputs: ['diagram', 'selectedDiagramObjects', 'isReadOnly']}),
      ],
      imports: [
        DmsThemeModule,
        FormsModule,
        NbThemeModule.forRoot(),
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiagramContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('resizeDiagram', () => {
    it('should emit resizing diagram event', () => {
      spyOn(component.resizingDiagram, 'next');

      component.resizeDiagram();

      expect(component.resizingDiagram.next).toHaveBeenCalled();
    });
  });
});

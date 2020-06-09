import { ChangeDetectionStrategy } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { blankPages } from 'core/models';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { Diagram } from '../../models/diagram.model';
import { InputData } from '../../models/inputData.model';
import { ObjectClassNames } from '../../models/objects.model';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { LOAD_OBJECT_DELAY, PreviewContainerComponent } from './preview-container.component';

describe('PreviewContainerComponent', () => {
  let component: PreviewContainerComponent;
  let fixture: ComponentFixture<PreviewContainerComponent>;
  let dispatchModelerStore: jasmine.Spy;
  let modelerStore: MockStore<fromModelerStore.IDecisionFirstState>;

  const diagram = new Diagram();
  diagram.id = 'diagram1000';
  diagram.goNodes = '{ "nodeId": {} }';
  const decision = new Decision();
  decision.id = 'decision1000';
  decision.description = 'description';
  const inputData = new InputData();
  inputData.id = 'inputData1000';
  inputData.description = 'description';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewContainerComponent,
        MockComponent({ selector: 'core-view-multiple-lines-control', inputs: ['text'] }),
        MockComponent({ selector: 'dfm-go-js-preview-diagram', inputs: ['diagram'] }),
        MockComponent({ selector: 'dfm-object-preview', inputs: ['object'] }),
      ],
      imports: [
        TestStoreModule,
        ReactiveFormsModule,
        DmsThemeModule,
        TranslateModule.forRoot(),
      ],
    })
    .overrideComponent(PreviewContainerComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    modelerStore.dispatch(new fromModelerStore.LoadDiagramSuccess(diagram));
    modelerStore.dispatch(new fromModelerStore.LoadDiagramsListSuccess({results:[], pagination: blankPages}));
    modelerStore.dispatch(new fromModelerStore.LoadAutocompleteSearchListSuccess({results:[], pagination: blankPages}));

    fixture = TestBed.createComponent(PreviewContainerComponent);
    component = fixture.componentInstance;
    component.to = diagram;

    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    spyOn(component.previewPopover, 'open');
    spyOn(component.previewPopover, 'close');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onMouseEnter', () => {
    it('should not dispatch Load action', fakeAsync(() => {
      component.to = diagram;
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
      tick(LOAD_OBJECT_DELAY);

      expect(dispatchModelerStore).not.toHaveBeenCalledWith(new fromModelerStore.LoadDiagram(diagram.id));
    }));

    it('should dispatch Load action', fakeAsync(() => {
      component.to = {id: '12345', className: ObjectClassNames.Diagram} as Diagram;
      fixture.detectChanges();
      
      fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
      tick(LOAD_OBJECT_DELAY);

      expect(dispatchModelerStore).toHaveBeenCalledWith(new fromModelerStore.LoadDiagram('12345'));
    }));

    describe('when object is diagram', () => {
      it('should not open preview if there are no nodes on diagram', fakeAsync(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadDiagramSuccess({...diagram, goNodes: ""} as Diagram));
        component.to = diagram;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).not.toHaveBeenCalled()
      }));
  
      it('should open preview if there are nodes on diagram', fakeAsync(() => {
        component.to = diagram;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).toHaveBeenCalled()
      }));
    });

    describe('when object is decision', () => {
      beforeEach(() => {
        modelerStore.dispatch(new fromModelerStore.LoadDecisionsListSuccess({results:[], pagination: blankPages}));
      });

      it('should open preview if there is question', fakeAsync(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadDecisionSuccess({...decision, description: '', question: 'Question'} as Decision));
        component.to = decision;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).toHaveBeenCalled()
      }));

      it('should open preview if there is no question but there is description', fakeAsync(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadDecisionSuccess(decision));
        component.to = decision;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).toHaveBeenCalled()
      }));

      it('should not open preview if there are no question and description', fakeAsync(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadDecisionSuccess({...decision, description: ''} as Decision));
        component.to = decision;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).not.toHaveBeenCalled()
      }));
    });

    describe('when object is inputData', () => {
      beforeEach(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadInputDatasListSuccess({results:[], pagination: blankPages}));
      });

      it('should not open preview if there is no description', fakeAsync(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadInputDataSuccess({...inputData, description: ''} as InputData));
        component.to = inputData;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).not.toHaveBeenCalled()
      }));
  
      it('should open preview if there is description', fakeAsync(() => {
        dispatchModelerStore.and.callThrough();
        modelerStore.dispatch(new fromModelerStore.LoadInputDataSuccess(inputData));
        component.to = inputData;
        fixture.detectChanges();
        
        fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseenter', null);
        tick(LOAD_OBJECT_DELAY);
  
        expect(component.previewPopover.open).toHaveBeenCalled()
      }));
    });
  });

  describe('onMouseLeave', () => {
    it('should close preview', () => {
      fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseleave', null);

      expect(component.previewPopover.close).toHaveBeenCalled()
    });

    it('should not dispatch RemovePreviewDiagramFromLocalMemory', () => {
      fixture.debugElement.query(By.css('.search-item')).triggerEventHandler('mouseleave', null);

      expect(dispatchModelerStore).not.toHaveBeenCalledWith(new fromModelerStore.RemovePreviewDiagramFromLocalMemory(diagram.id));
    });
  });

  describe('isDiagramPreview', () => {
    it('should return true', () => {
      component.to = diagram;

      expect(component.isDiagramPreview()).toBeTruthy();
    });

    it('should return false if object is undefined', () => {
      delete component.to;

      expect(component.isDiagramPreview()).toBeFalsy();
    });

    it('should return false if object is not Diagram', () => {
      component.to = decision;

      expect(component.isDiagramPreview()).toBeFalsy();
    });
  });
});

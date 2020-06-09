import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Diagram } from '../../../models/diagram.model';
import { DiagramLinkType } from '../../../models/goJsDiagram.model';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers';
import { emulateDiagramClick } from '../../../testing/emulate-diagram-click.spec';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { GoJsLinksPaletteComponent } from './go-js-links-palette.component';

describe('GoJsLinksPaletteComponent', () => {
  let component: GoJsLinksPaletteComponent;
  let fixture: ComponentFixture<GoJsLinksPaletteComponent>;
  let store: Store<IDecisionFirstState>;

  const diagram = new Diagram();
  diagram.id = 'diagram1000';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoJsLinksPaletteComponent],
      imports: [
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(GoJsLinksPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('manage link type', () => {
    beforeEach(() => {
      component.diagram = diagram;
    });

    describe(('information link type'), () => {
      it('should store dispatch', () => {
        component.currentLinkType = null;
        fixture.detectChanges();

        const informationLinkLocation = component.palette.findNodeForKey(DiagramLinkType.Information).location;
        emulateDiagramClick(component.palette, informationLinkLocation.x, informationLinkLocation.y, 1);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetLinkTypeActiveDiagram({
            id: 'diagram1000',
            linkType: DiagramLinkType.Information,
          }),
        );
      });

      it('should not store dispatch', () => {
        component.currentLinkType = DiagramLinkType.Information;
        fixture.detectChanges();
        
        const informationLinkLocation = component.palette.findNodeForKey(DiagramLinkType.Information).location;
        emulateDiagramClick(component.palette, informationLinkLocation.x, informationLinkLocation.y, 1);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe(('authority link type'), () => {
      it('should store dispatch', () => {
        component.currentLinkType = null;
        fixture.detectChanges();

        const authorityLinkLocation = component.palette.findNodeForKey(DiagramLinkType.Authority).location;
        emulateDiagramClick(component.palette, authorityLinkLocation.x, authorityLinkLocation.y, 1);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetLinkTypeActiveDiagram({
            id: 'diagram1000',
            linkType: DiagramLinkType.Authority,
          }),
        );
      });

      it('should not store dispatch', () => {
        component.currentLinkType = DiagramLinkType.Authority;
        fixture.detectChanges();
        
        const authorityLinkLocation = component.palette.findNodeForKey(DiagramLinkType.Authority).location;
        emulateDiagramClick(component.palette, authorityLinkLocation.x, authorityLinkLocation.y, 1);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe(('annotation link type'), () => {
      it('should store dispatch', () => {
        component.currentLinkType = null;
        fixture.detectChanges();

        const annotationLinkLocation = component.palette.findNodeForKey(DiagramLinkType.Annotation).location;
        emulateDiagramClick(component.palette, annotationLinkLocation.x, annotationLinkLocation.y, 1);

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.SetLinkTypeActiveDiagram({
            id: 'diagram1000',
            linkType: DiagramLinkType.Annotation,
          }),
        );
      });

      it('should not store dispatch', () => {
        component.currentLinkType = DiagramLinkType.Annotation;
        fixture.detectChanges();
        
        const annotationLinkLocation = component.palette.findNodeForKey(DiagramLinkType.Annotation).location;
        emulateDiagramClick(component.palette, annotationLinkLocation.x, annotationLinkLocation.y, 1);

        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });
});

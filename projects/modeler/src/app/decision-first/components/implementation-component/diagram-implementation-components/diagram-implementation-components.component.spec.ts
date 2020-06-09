import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectTabType } from 'core/models';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromStore from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { DiagramImplementationComponentsComponent } from './diagram-implementation-components.component';

class FakeDomSanitizer {
  bypassSecurityTrustResourceUrl(value: string){ }
}

describe('DiagramImplementationComponentsComponent', () => {
  let component: DiagramImplementationComponentsComponent;
  let fixture: ComponentFixture<DiagramImplementationComponentsComponent>;
  let store: Store<IDecisionFirstState>;

  const correctImplementationComponent = new ImplementationComponent();
  correctImplementationComponent.id = 'correctImplementationComponent';
  correctImplementationComponent.url = 'https://example.com/correctImplementationComponent';

  const correctUrlWithoutProtocolImplementationComponent = new ImplementationComponent();
  correctUrlWithoutProtocolImplementationComponent.id = 'correctUrlWithoutProtocolImplementationComponent';
  correctUrlWithoutProtocolImplementationComponent.url = 'example.com/test';

  const incorrectUrlImplementationComponent = new ImplementationComponent();
  incorrectUrlImplementationComponent.id = 'incorrectUrlImplementationComponent';
  incorrectUrlImplementationComponent.url = 'incorrect-url';

  const icons = [{
      id: 'icon1',
    } as ImplementationComponentIcon
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiagramImplementationComponentsComponent],
      imports: [
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(DiagramImplementationComponentsComponent);
    component = fixture.componentInstance;
    component.icons = icons;
    component.implementationComponents = [
      correctImplementationComponent,
      correctUrlWithoutProtocolImplementationComponent,
      incorrectUrlImplementationComponent,
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open implementation component tab', () => {
    spyOn(store, 'dispatch');

    fixture.debugElement
      .query(By.css('#panel-implementation-component-correctImplementationComponent'))
      .triggerEventHandler('dblclick', null);

    expect(store.dispatch).toHaveBeenCalledWith(
      new fromStore.AddTab({
        id: correctImplementationComponent.id,
        type: ObjectTabType.ImplementationComponent,
      }),
    );
  });

  it('should open implementation component url', () => {
    spyOn(window, 'open');

    fixture.debugElement
      .query(By.css('#panel-implementation-component-correctImplementationComponent'))
      .triggerEventHandler('contextmenu', null);

    expect(window.open).toHaveBeenCalledWith(correctImplementationComponent.url, '_blank');
  });

  it('should open implementation component url with protocol', () => {
    spyOn(window, 'open');

    fixture.debugElement
      .query(By.css('#panel-implementation-component-correctUrlWithoutProtocolImplementationComponent'))
      .triggerEventHandler('contextmenu', null);

    expect(window.open).toHaveBeenCalledWith(
      'http://' + correctUrlWithoutProtocolImplementationComponent.url,
      '_blank',
    );
  });

  it('should not open incorrect implementation component url', () => {
    spyOn(window, 'open');

    fixture.debugElement
      .query(By.css('#panel-implementation-component-incorrectUrlImplementationComponent'))
      .triggerEventHandler('contextmenu', null);

    expect(window.open).not.toHaveBeenCalled();
  });

  describe('transformToSafeSvgResourceUrl', () => {
    it('should return safe resource url', () => {
      spyOn(TestBed.get(DomSanitizer), 'bypassSecurityTrustResourceUrl').and.returnValue('safe string');
    
      const result = component.transformToSafeSvgResourceUrl({
        iconId: 'icon1',
      } as ImplementationComponent);

      expect(result).toEqual('safe string');
    });
  });
});

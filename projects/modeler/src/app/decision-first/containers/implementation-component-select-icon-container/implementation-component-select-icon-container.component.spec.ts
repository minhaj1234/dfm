import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { ImplementationComponent } from '../../models/implementationComponent.model';
import * as fromModelerStore from '../../store';
import * as fromActions from '../../store/actions';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { ImplementationComponentSelectIconContainerComponent } from './implementation-component-select-icon-container.component';

describe('ImplementationComponentSelectIconContainerComponent', () => {
  let component: ImplementationComponentSelectIconContainerComponent;
  let fixture: ComponentFixture<ImplementationComponentSelectIconContainerComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatch: jasmine.Spy;

  const implementationComponent = {
    id: 'implementationComponent1000',
    iconId: 'icon1',
    _links: {
      self: {
        href: 'http://',
      }
    }
  } as ImplementationComponent;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImplementationComponentSelectIconContainerComponent,
        MockComponent({ selector: 'dfm-implementation-component-select-icon', inputs: ['icons', 'isReadOnly'] }, true),
        MockComponent({ selector: 'dfm-upload-implementation-component-icon', inputs: ['object', 'isReadOnly'] }),
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationComponentSelectIconContainerComponent);
    modelerStore = TestBed.get(Store);

    modelerStore.dispatch(new fromModelerStore.LoadImplementationComponentSuccess(implementationComponent));   
    dispatch = spyOn(modelerStore, 'dispatch');

    component = fixture.componentInstance;
    component.objectId = implementationComponent.id;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setSelectIconFormValue', () => {
    it('should set form value', () => {
      const patchValue = spyOn(component.selectIconForm, 'patchValue');

      component.setSelectIconFormValue();

      expect(patchValue).toHaveBeenCalledWith({ iconId: 'icon1' }, { emitEvent: false });
    });
  });

  describe('loadImplementationComponentIcon', () => {
    it('should dispatch LoadImplementationComponentsIcon', () => {
      component.loadImplementationComponentIcon();

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadImplementationComponentsIcon('icon1'));
    });
  });

  describe('onSelectIconClick', () => {
    it('should dispatch LoadImplementationComponentsIcons', () => {
      component.onSelectIconClick();

      expect(dispatch).toHaveBeenCalledWith(new fromActions.LoadImplementationComponentsIcons());
    });
  });

  describe('change value', () => {
    it('should dispatch UpdateImplementationComponent', () => {
      spyOn(component, 'subscribeSeletcIconFormState');

      component.selectIconForm.setValue({iconId: 'newIconId'});

      expect(dispatch).toHaveBeenCalledWith(new fromActions.UpdateImplementationComponent({
        implementationComponent: {
          ...implementationComponent,
          iconId: 'newIconId',
        }
      }));
    });
  });
});

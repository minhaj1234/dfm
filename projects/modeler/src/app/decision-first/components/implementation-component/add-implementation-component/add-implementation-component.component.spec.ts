import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { MockComponent, NbDialogRefMock } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../../store';
import * as fromActions from '../../../store/actions';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddImplementationComponentComponent } from './add-implementation-component.component';

describe('AddImplementationComponentComponent', () => {
  let component: AddImplementationComponentComponent;
  let fixture: ComponentFixture<AddImplementationComponentComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatch: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddImplementationComponentComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'dfm-implementation-component-select-icon', inputs: ['icons', 'isReadOnly'] }, true),
      ],
      imports: [
        DmsThemeModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
      providers: [NbDialogService, { provide: NbDialogRef, useClass: NbDialogRefMock }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatch = spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(AddImplementationComponentComponent);
    component = fixture.componentInstance;
    spyOn(component, 'loadImplementationComponentsIcons');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new implementation component', () => {
    const implementationComponent = {
      name: 'test name',
      description: 'test description',
      url: 'test url',
      iconId: 'iconId',
    };

    component.formGroup.setValue(implementationComponent);

    triggerMouseClick(fixture, '.add-implementation-component');

    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddImplementationComponent(implementationComponent));
  });

  it('should do not create implementation component if form invalid', () => {
    const implementationComponent = {
      name: null,
      description: 'test description',
      url: 'test url',
      iconId: 'test icon id'
    };

    component.formGroup.setValue(implementationComponent);

    triggerMouseClick(fixture, '.add-implementation-component');

    expect(modelerStore.dispatch).not.toHaveBeenCalled();
  });

  describe('subscribeImplementationComponentIcons', () => {
    it('should set default icon id', () => {
      dispatch.and.callThrough();
      modelerStore.dispatch(new fromActions.LoadImplementationComponentsIconsSuccess([{
        id: 'icon1'
      }] as ImplementationComponentIcon[]));
      
      expect(component.selectedIconId).toEqual('icon1');
    });
  });
});

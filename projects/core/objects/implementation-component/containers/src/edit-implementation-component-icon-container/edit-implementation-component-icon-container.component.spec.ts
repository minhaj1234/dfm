import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as fromStore from 'core/objects/implementation-component/store';
import { MockComponent, TestStoreModule } from 'core/testing';
import { EditImplementationComponentIconContainerComponent } from './edit-implementation-component-icon-container.component';

describe('EditImplementationComponentIconContainerComponent', () => {
  let component: EditImplementationComponentIconContainerComponent;
  let fixture: ComponentFixture<EditImplementationComponentIconContainerComponent>;
  let store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditImplementationComponentIconContainerComponent,
        MockComponent({
          selector: 'core-edit-implementation-component-icon',
          inputs: ['icon']
        }),
      ],
      imports: [
        TranslateModule.forRoot(),
        TestStoreModule,
        NbCardModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImplementationComponentIconContainerComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    dispatchModelerStore = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

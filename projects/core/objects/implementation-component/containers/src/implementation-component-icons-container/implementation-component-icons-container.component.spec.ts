import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as fromStore from 'core/objects/implementation-component/store';
import { MockComponent } from 'core/testing';
import { TestStoreModule } from 'core/testing';
import { ImplementationComponentIconsContainerComponent } from './implementation-component-icons-container.component';

describe('ImplementationComponentIconsContainerComponent', () => {
  let component: ImplementationComponentIconsContainerComponent;
  let fixture: ComponentFixture<ImplementationComponentIconsContainerComponent>;
  let store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImplementationComponentIconsContainerComponent,
        MockComponent({ selector: 'core-implementation-component-icon-table', inputs: ['icons'] }, false),
        MockComponent({ selector: 'core-upload-implementation-component-icon', inputs: ['displayForm'] }, false),
      ],
      imports: [
        TranslateModule.forRoot(),
        TestStoreModule,
        NbCardModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationComponentIconsContainerComponent);
    component = fixture.componentInstance;
    spyOn(component, 'subscribeImplementationComponentIconsState');

    store = TestBed.get(Store);
    dispatchModelerStore = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import * as fromImplementationComponentStore from 'core/objects/implementation-component/store';
import { MessageService } from 'core/services';
import { triggerMouseClick, FakeMessageService, MockComponent, TestStoreModule } from 'core/testing';
import { ImplementationComponentIconTableComponent } from './implementation-component-icon-table.component';

describe('ImplementationComponentIconTableComponent', () => {
  let component: ImplementationComponentIconTableComponent;
  let fixture: ComponentFixture<ImplementationComponentIconTableComponent>;
  let store: Store<fromImplementationComponentStore.DecisionFirstImplementationComponentsIconsState>;
  let dispatchStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImplementationComponentIconTableComponent,
        MockComponent({ selector: 'core-upload-implementation-component-icon', inputs: [] }, true),
      ],
      providers: [
        { provide: MessageService, useValue: new FakeMessageService() }
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    })
    .overrideComponent(ImplementationComponentIconTableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationComponentIconTableComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    dispatchStore = spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('click delete icon', () => {
    it('should dispatch DeleteImplementationComponentsIcon', () => {
      component.icons = [{id: 'icon1', base64: ''} as ImplementationComponentIcon];
      fixture.detectChanges();

      triggerMouseClick(fixture, '.nb-close');

      expect(dispatchStore).toHaveBeenCalledWith(new fromImplementationComponentStore.DeleteImplementationComponentsIcon('icon1'));
    });
  });
});

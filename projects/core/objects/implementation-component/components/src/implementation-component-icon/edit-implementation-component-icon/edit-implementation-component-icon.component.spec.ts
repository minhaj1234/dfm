import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCheckboxModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as fromImplementationConponentStore from 'core/objects/implementation-component/store';
import { MessageService } from 'core/services';
import { FakeMessageService, TestStoreModule } from 'core/testing';
import { EditImplementationComponentIconComponent } from './edit-implementation-component-icon.component';

describe('EditImplementationComponentIconComponent', () => {
  let component: EditImplementationComponentIconComponent;
  let fixture: ComponentFixture<EditImplementationComponentIconComponent>;
  let store: Store<fromImplementationConponentStore.DecisionFirstImplementationComponentsIconsState>;
  let dispatch: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditImplementationComponentIconComponent,
      ],
      providers: [
        { provide: MessageService, useValue: new FakeMessageService() }
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
        NbCheckboxModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImplementationComponentIconComponent);
    component = fixture.componentInstance;

    store = TestBed.get(Store);
    dispatch = spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ITab, JumpMenuItems, ObjectTabType } from 'core/models';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { Decision } from '../../../models/decision.model';
import { DfmObjects, ObjectClassNames } from '../../../models/objects.model';
import { ObjectPreviewComponent } from './object-preview.component';

describe('ObjectPreviewComponent', () => {
  let component: ObjectPreviewComponent;
  let fixture: ComponentFixture<ObjectPreviewComponent>;
  const object = new Decision();
  object.description = 'object description';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ObjectPreviewComponent,
        MockComponent({ selector: 'dfm-decision-answer', inputs: ['decision', 'isReadOnly'] }),
      ],
      imports: [
        DmsThemeModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectPreviewComponent);
    component = fixture.componentInstance;
    component.object = object;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

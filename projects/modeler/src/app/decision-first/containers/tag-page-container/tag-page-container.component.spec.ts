import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'core/testing'
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { TagPageContainerComponent } from './tag-page-container.component';

describe('TagPageContainerComponent', () => {
  let component: TagPageContainerComponent;
  let fixture: ComponentFixture<TagPageContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagPageContainerComponent,
        MockComponent({ selector: 'dfm-edit-tag', inputs: ['tag'] }),
        MockComponent({ selector: 'dfm-tag-associated-objects-display', inputs: ['tag'] }),
      ],
      imports: [
        DmsThemeModule,
        TestStoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

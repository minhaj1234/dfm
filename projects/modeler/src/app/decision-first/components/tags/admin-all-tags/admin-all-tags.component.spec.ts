import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AdminAllTagsComponent } from './admin-all-tags.component';

describe('AdminAllTagsComponent', () => {
  let component: AdminAllTagsComponent;
  let fixture: ComponentFixture<AdminAllTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminAllTagsComponent,
        MockComponent({ selector: 'core-tag', inputs: ['addTabAction', 'id', 'text', 'size'] }),
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
      ],
      imports: [
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAllTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

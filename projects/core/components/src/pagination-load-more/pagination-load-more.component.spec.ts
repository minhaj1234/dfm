import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { IPagination } from 'core/models';
import { triggerMouseClick, TestStoreModule } from 'core/testing';
import { PaginationLoadMoreComponent } from './pagination-load-more.component';

class FakeGetMore implements Action {
  readonly type = 'getMore';
  constructor(payload: string) {}
}

@Component({
  template: `
    <core-pagination-load-more #actual
      [store]="store"
      [pagination]="pagination"
      [getMoreAction]="getMoreAction"
    >
    </core-pagination-load-more>`,
})
class TestHostComponent {
  getMoreAction = FakeGetMore;
  pagination: IPagination;
  @ViewChild('actual', { static: true }) actual: PaginationLoadMoreComponent;

  constructor(private store: Store<unknown>) {}
}

describe('PaginationLoadMoreComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let store: Store<unknown>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, PaginationLoadMoreComponent],
      imports: [
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentlyLoadedCount', () => {
    it('returns the correct currently loaded count', () => {
      component.pagination = {
        number: 1,
        size: 2,
        totalElements: 9,
        totalPages: 5,
      };
      fixture.detectChanges();
      expect(component.actual.currentlyLoadedCount).toEqual(4);
    });

    it('returns the totalElements in case the (number + 1) * size is bigger than totalElements', () => {
      component.pagination = {
        number: 4,
        size: 2,
        totalElements: 9,
        totalPages: 5,
      };
      fixture.detectChanges();
      expect(component.actual.currentlyLoadedCount).toEqual(9);
    });
  });

  describe('getMore', () => {
    it('dispatches the getMoreAction', () => {
      spyOn(store, 'dispatch');
      component.pagination = {
        nextUrl: 'http://',
        number: 1,
        size: 2,
        totalElements: 9,
        totalPages: 5,
      };
      fixture.detectChanges();
      triggerMouseClick(fixture, '.get-more-results');

      expect(store.dispatch).toHaveBeenCalledWith(new FakeGetMore('http://'));
    });
  });
});

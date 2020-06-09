import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Resource } from 'angular4-hal';
import { IPagination } from 'core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'core-objects-list',
  template: '',
})
export class ObjectsListComponent implements OnInit {
  @Input() objectsList: Resource[];
  @Input() isReadOnly: boolean;
  
  openTabAction: any;
  deleteObjectAction: any;

  paginationSelector: any;
  pagination$: Observable<IPagination>;

  constructor(
    private store: Store<unknown>,
  ) { }

  ngOnInit() {
    this.pagination$ = this.store.pipe(select(this.paginationSelector));
  }

  trackByFn(index: number, object: any): string {
    return object.id;
  }

  openObjectTab(object: any): void {
    this.store.dispatch(
      new this.openTabAction({
        id: object.id,
        type: object.className,
      }),
    );
  }

  deleteObject(object: any): void {
    this.store.dispatch(
      new this.deleteObjectAction(object)
    );
  }
}

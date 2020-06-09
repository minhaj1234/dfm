import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import * as fromStore from 'core/objects/implementation-component/store';
import { TestStoreModule } from 'core/testing';

describe('ImplementationComponents Selectors', () => {
  let store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>;

  const implementationComponentIcons: ImplementationComponentIcon[] = [
    {
      id: 'icon1',
      name: 'name1',
      tooltip: 'description 1',
      base64: 'icon1 base64 string'
    } as ImplementationComponentIcon,
    {
      id: 'icon2',
      name: 'name2',
      tooltip: 'description 2',
      base64: 'icon2 base64 string'
    } as ImplementationComponentIcon
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
        StoreModule.forFeature('DecisionFirst', fromStore.reducers),
      ],
    });

    store = TestBed.get(Store);
  });

  describe('getSelectedImplementationComponentIcon', () => {
    it('should return selected implementation component icon', () => {
      let result;

      store.pipe(select(fromStore.getSelectedImplementationComponentIcon(implementationComponentIcons[0].id))).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual(undefined);

      store.dispatch(new fromStore.LoadImplementationComponentsIconSuccess(implementationComponentIcons[0]));
      store.dispatch(new fromStore.LoadImplementationComponentsIconSuccess(implementationComponentIcons[1]));

      expect(result).toEqual(implementationComponentIcons[0]);
    });
  });

  describe('getDisplayUploadImplementationComponentIconForm', () => {
    it('should return upload icon form state', () => {
      let result;

      store.pipe(select(fromStore.getDisplayUploadImplementationComponentIconForm)).subscribe((value) => {
        result = value;
      });

      expect(result).toBeFalsy();

      store.dispatch(new fromStore.OpenUploadImplementationComponentsIconForm());

      expect(result).toBeTruthy();
    });
  });
});

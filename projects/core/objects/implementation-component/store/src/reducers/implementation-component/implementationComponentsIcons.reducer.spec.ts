import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import * as fromActions from '../../actions';
import * as fromImplementationComponentsIcons from './implementationComponentsIcons.reducer';

describe('ImplementationComponentsIcons Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = {} as any;

      const state = fromImplementationComponentsIcons.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.LoadImplementationComponentsIcons();

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.genericNetworkActive).toBeTruthy();
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.LoadImplementationComponentsIconsSuccess([ {id: 'abc'} as ImplementationComponentIcon]);

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);    
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.LoadImplementationComponentsIcon('abc');

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.networkActive).toEqual({abc: true});
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.LoadImplementationComponentsIconSuccess({id: 'abc'} as ImplementationComponentIcon);

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.networkActive).toEqual({});
      expect(state.entities).toEqual({ abc: { id: 'abc' } } as any);  
    });
  });

  describe(`${fromActions.DELETE_IMPLEMENTATION_COMPONENTS_ICON} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.DeleteImplementationComponentsIcon('abc');

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.networkActive).toEqual({abc: true});
    });
  });

  describe(`${fromActions.IMPLEMENTATION_COMPONENTS_ICONS_FAILURE} action`, () => {
    it('should have networkLoading be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.ImplementationComponentsIconsFailure({id: 'abc', error: new Error()});

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.networkActive).toEqual({});
    });
  });

  describe(`${fromActions.GENERIC_IMPLEMENTATION_COMPONENTS_ICONS_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.GenericImplementationComponentsIconsFailure(new Error());

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.genericNetworkActive).toBeFalsy();
    });
  });

  describe(`${fromActions.UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS} action`, () => {
    it('should set displayUploadIconForm to false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.UploadImplementationComponentsIconSuccess();

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.displayUploadIconForm).toBeFalsy();
    });
  });

  describe(`${fromActions.OPEN_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM} action`, () => {
    it('should set displayUploadIconForm to true', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.OpenUploadImplementationComponentsIconForm();

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.displayUploadIconForm).toBeTruthy();
    });
  });

  describe(`${fromActions.CLOSE_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM} action`, () => {
    it('should set displayUploadIconForm to false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const action = new fromActions.CloseUploadImplementationComponentsIconForm();

      const state = fromImplementationComponentsIcons.reducer(initialState, action);

      expect(state.displayUploadIconForm).toBeFalsy();
    });
  });

  describe(`${fromActions.REMOVE_IMPLEMENTATION_COMPONENTS_ICON_FROM_LOCAL_MEMORY} action`, () => {
    it('should set networkLoading be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true} };
      const action = new fromActions.RemovelementationComponentIconFromLocalMemory('abc');

      const state = fromImplementationComponentsIcons.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
    it('should set networkLoading be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const stateWithEntities = { ...initialState, entities: { abc: { id: 'abc' } as any }};
      const action = new fromActions.RemovelementationComponentIconFromLocalMemory('abc');
  
      const state = fromImplementationComponentsIcons.reducer(stateWithEntities, action);
  
      expect(state.entities).toEqual({});  
    });
  });

  describe(`${fromActions.FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENTS_ICONS} action`, () => {
    it('should set networkLoading be false', () => {
      const { initialState } = fromImplementationComponentsIcons;
      const stateWithNetworkActive = { ...initialState, networkActive: { abc: true} };
      const action = new fromActions.FinishedNetworkRequestForImplementationComponentsIcon('abc');

      const state = fromImplementationComponentsIcons.reducer(stateWithNetworkActive, action);

      expect(state.networkActive).toEqual({});
    });
  });
});

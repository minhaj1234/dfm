import { ImplementationComponentIcon, UploadImplementationComponentIconRequest } from 'core/objects/implementation-component/models';
import * as implementationComponentsIconsActions from './implementationComponentsIcons.actions';

describe('ImplementationComponentsIcons Actions', () => {
  describe('Load Implementation Components Icons', () => {
    it('should create an action', () => {
      const action = new implementationComponentsIconsActions.LoadImplementationComponentsIcons();
    
      expect({ ...action }).toEqual({
        type: implementationComponentsIconsActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS,
      });
    });
  });

  describe('Load Implementation Components Icons Success', () => {
    it('should create an action', () => {
      const payload = [{} as ImplementationComponentIcon];

      const action = new implementationComponentsIconsActions.LoadImplementationComponentsIconsSuccess(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.LOAD_IMPLEMENTATION_COMPONENTS_ICONS_SUCCESS,
      });
    });
  });

  describe('Load Implementation Components Icon', () => {
    it('should create an action', () => {
      const payload = 'id';

      const action = new implementationComponentsIconsActions.LoadImplementationComponentsIcon(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON,
      });
    });
  });

  describe('Load Implementation Components Icon Success', () => {
    it('should create an action', () => {
      const payload = {} as ImplementationComponentIcon;

      const action = new implementationComponentsIconsActions.LoadImplementationComponentsIconSuccess(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.LOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS,
      });
    });
  });

  describe('DeleteImp lementation Components Icon', () => {
    it('should create an action', () => {
      const payload = 'id';

      const action = new implementationComponentsIconsActions.DeleteImplementationComponentsIcon(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.DELETE_IMPLEMENTATION_COMPONENTS_ICON,
      });
    });
  });

  describe('Upload Implementation Components Icon', () => {
    it('should create an action', () => {
      const payload = {} as UploadImplementationComponentIconRequest;

      const action = new implementationComponentsIconsActions.UploadImplementationComponentsIcon(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.UPLOAD_IMPLEMENTATION_COMPONENTS_ICON,
      });
    });
  });

  describe('Upload Implementation Components Icon Success', () => {
    it('should create an action', () => {
      const action = new implementationComponentsIconsActions.UploadImplementationComponentsIconSuccess();
    
      expect({ ...action }).toEqual({
        type: implementationComponentsIconsActions.UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS,
      });
    });
  });
  
  describe('Implementation Components Icons Failure', () => {
    it('should create an action', () => {
      const payload = {error: new Error(), id: 'id'};

      const action = new implementationComponentsIconsActions.ImplementationComponentsIconsFailure(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.IMPLEMENTATION_COMPONENTS_ICONS_FAILURE,
      });
    });
  });

  describe('Generic Implementation Components Icons Failure', () => {
    it('should create an action', () => {
      const payload = new Error();

      const action = new implementationComponentsIconsActions.GenericImplementationComponentsIconsFailure(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.GENERIC_IMPLEMENTATION_COMPONENTS_ICONS_FAILURE,
      });
    });
  });

  describe('Finished Network Request For Decision Implementation Components Icon', () => {
    it('should create an action', () => {
      const payload = 'id';

      const action = new implementationComponentsIconsActions.FinishedNetworkRequestForImplementationComponentsIcon(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENTS_ICONS,
      });
    });
  });

  describe('Open Upload Implementation Components Icon Form', () => {
    it('should create an action', () => {
      const action = new implementationComponentsIconsActions.OpenUploadImplementationComponentsIconForm();
    
      expect({ ...action }).toEqual({
        type: implementationComponentsIconsActions.OPEN_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM,
      });
    });
  });

  describe('Close Upload Implementation Components Icon Form', () => {
    it('should create an action', () => {
      const action = new implementationComponentsIconsActions.CloseUploadImplementationComponentsIconForm();
    
      expect({ ...action }).toEqual({
        type: implementationComponentsIconsActions.CLOSE_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM,
      });
    });
  });
  
  describe('Remove lementation Component Icon From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'id';

      const action = new implementationComponentsIconsActions.RemovelementationComponentIconFromLocalMemory(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: implementationComponentsIconsActions.REMOVE_IMPLEMENTATION_COMPONENTS_ICON_FROM_LOCAL_MEMORY,
      });
    });
  });
});

import { Decision } from '../../../models/decision.model';
import { Event, IEventUpdate } from '../../../models/events.model';
import { ObjectRelationsNames } from '../../../models/objects.model';
import * as eventActions from './event.action';

describe('Event Actions', () => {
  describe('Load Event', () => {
    it('should create an action', () => {
      const payload = '12345';
     
      const action = new eventActions.LoadEvent(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.LOAD_EVENT,
      });
    });
  });

  describe('Load Event Success', () => {
    it('should create an action', () => {
      const payload: Event = {} as any;
    
      const action = new eventActions.LoadEventSuccess(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.LOAD_EVENT_SUCCESS,
      });
    });
  });

  describe('Add Event', () => {
    it('should create an action', () => {
      const payload = {
        name: 'test name',
        description: 'test description',
        url: 'test url'
      };

      const action = new eventActions.AddEvent(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.ADD_EVENT,
      });
    });
  });

  describe('Update Event', () => {
    it('should create an action', () => {
      const payload: IEventUpdate = {
        event: {
          id: 'test id',
          name: 'test name',
          description: 'test description',
          url: 'test url',
          _links: {} as any,
        }
      };

      const action = new eventActions.UpdateEvent(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.UPDATE_EVENT,
      });
    });
  });

  describe('Delete Event', () => {
    it('should create an action', () => {
      const payload: Event = {} as any;
     
      const action = new eventActions.DeleteEvent(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.DELETE_EVENT,
      });
    });
  });

  describe('Add Related Object To Event', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Event(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new eventActions.AddRelatedObjectToEvent(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.ADD_RELATED_OBJECT_TO_EVENT,
      });
    });
  });

  describe('Update Event Related Object', () => {
    it('should create an action', () => {
      const payload = {object: new Decision(), paths: ['test path']};
    
      const action = new eventActions.UpdateEventRelatedObject(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.UPDATE_EVENT_RELATED_OBJECT,
      });
    });
  });


  describe('Remove Related Object From Event', () => {
    it('should create an action', () => {
      const payload = {
        sourceObject: new Event(),
        relatedObject: new Decision(),
        relatedPath: ObjectRelationsNames.Decisions,
      } as any;

      const action = new eventActions.RemoveRelatedObjectFromEvent(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.REMOVE_RELATED_OBJECT_FROM_EVENT,
      });
    });
  });

  describe('Load Event As Child', () => {
    it('should create an action', () => {
      const payload = 'test id';
      
      const action = new eventActions.LoadEventAsChild(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.LOAD_EVENT_AS_CHILD,
      });
    });
  });

  describe('Finished Network Request For Event', () => {
    it('should create an action', () => {
      const payload = 'eventTestId';
    
      const action = new eventActions.FinishedNetworkRequestForEvent(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.FINISHED_NETWORK_REQUEST_FOR_EVENT,
      });
    });
  });

  describe('Finished Generic Network Request For Event', () => {
    it('should create an action', () => {
      const action = new eventActions.FinishedGenericNetworkRequestForEvent();
      
      expect({ ...action }).toEqual({
        type: eventActions.FINISHED_GENERIC_NETWORK_REQUEST_FOR_EVENT,
      });
    });
  });

  describe('Event Failure', () => {
    it('should create an action', () => {
      const payload = { error: new Error('Fail message'), id: '1234' };
      const action = new eventActions.EventFailure(payload);
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.EVENT_FAILURE,
      });
    });
  });

  describe('Generic Event Failure', () => {
    it('should create an action', () => {
      const payload = new Error('test error message');
    
      const action = new eventActions.GenericEventFailure(payload);
    
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.GENERIC_EVENT_FAILURE,
      });
    });
  });

  describe('Remove Event From Local Memory', () => {
    it('should create an action', () => {
      const payload = 'test id';
     
      const action = new eventActions.RemoveEventFromLocalMemory(payload);
     
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.REMOVE_EVENT_FROM_LOCAL_MEMORY,
      });
    });
  });

  describe('Remove Preview Event From Local Memory', () => {
    it('should create an action', () => {
      const payload = '12345';
      
      const action = new eventActions.RemovePreviewEventFromLocalMemory(payload);
      
      expect({ ...action }).toEqual({
        payload,
        type: eventActions.REMOVE_PREVIEW_EVENT_FROM_LOCAL_MEMORY,
      });
    });
  });
});

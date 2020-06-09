import { VersionInformation } from 'core/models';
import * as fromActions from './version-information.actions';

describe('Version Information Actions', () => {
  describe('LoadVersionInformation', () => {
    it('should create an action', () => {
      const action = new fromActions.LoadVersionInformation();

      expect({ ...action }).toEqual({
        type: fromActions.LOAD_VERSION_INFORMATION,
      });
    });
  });

  describe('LoadVersionInformationSuccess', () => {
    it('should create an action', () => {
      const payload = {} as VersionInformation;

      const action = new fromActions.LoadVersionInformationSuccess(payload);

      expect({ ...action }).toEqual({
        payload,
        type: fromActions.LOAD_VERSION_INFORMATION_SUCCESS,
      });
    });
  });

  describe('UpdateVersionInformation', () => {
    it('should create an action', () => {
      const payload = {} as VersionInformation;

      const action = new fromActions.UpdateVersionInformation(payload);

      expect({ ...action }).toEqual({
        payload,
        type: fromActions.UPDATE_VERSION_INFORMATION,
      });
    });
  });
 
  describe('VersionInformationFailure', () => {
    it('should create an action', () => {
      const payload = new Error();

      const action = new fromActions.VersionInformationFailure(payload);

      expect({ ...action }).toEqual({
        payload,
        type: fromActions.LOAD_VERSION_INFORMATION_FAILURE,
      });
    });
  });
});

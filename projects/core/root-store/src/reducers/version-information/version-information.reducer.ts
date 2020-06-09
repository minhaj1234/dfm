import { IActionMap } from 'core/models';
import * as fromActions from '../../actions';

export interface IVersionInformationState {
  information: string;
	supportLink: string;
}

export const initialState: IVersionInformationState = {
  information: '',
	supportLink: '',
};

const actionMap: IActionMap<IVersionInformationState, fromActions.VersionInformationActions> = {
  [fromActions.LOAD_VERSION_INFORMATION_SUCCESS]: loadVersionInformationSuccessHandler,
};

export function reducer(
  state: IVersionInformationState = initialState,
  action: fromActions.VersionInformationActions,
): IVersionInformationState {
  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
}

function loadVersionInformationSuccessHandler(
  state: IVersionInformationState,
  action: fromActions.LoadVersionInformationSuccess,
): IVersionInformationState {
  return {
    ...state,
    information: action.payload.information,
    supportLink: action.payload.supportLink,
  };
}

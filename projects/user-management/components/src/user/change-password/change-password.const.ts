import { getI18nString } from 'core/utilities';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const ERROR_MESSAGES = {
  matchPassword: getI18nString('newConfirmNewDontMatch'),
  minlength: getI18nString('doesntMeetRequirementsBetween8and64Characters'),
  maxlength: getI18nString('doesntMeetRequirementsBetween8and64Characters'),
};

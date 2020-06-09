export interface ILoginContainerState {
  authenticationInProgress: boolean;
  forgotPasswordInProgress: boolean;
  authenticationError: boolean;
  versionInformation: string;
  supportLink: string
  authorizationError: boolean;
}

export interface LoginContainerOptions {
  displayVersionInformation: boolean
}
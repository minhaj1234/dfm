import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  VersionInformation } from 'core/models';
import { versionInformationReducer } from '../../reducers';

export const getVersionInformationState = createFeatureSelector<versionInformationReducer.IVersionInformationState>('versionInformation');


export const getVersionInformation = createSelector(
  getVersionInformationState,
  versionInformationState => (<VersionInformation>{
    information: versionInformationState.information,
    supportLink: versionInformationState.supportLink,
  })
);

import { blankPages } from 'core/models';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as knowledgeSourcesActions from './knowledgeSourcesList.actions';

describe('Knowledge Sources List Actions', () => {
  describe('Load Knowledge Sources List', () => {
    it('should create an action', () => {
      const action = new knowledgeSourcesActions.LoadKnowledgeSourcesList();
      expect({ ...action }).toEqual({
        type: knowledgeSourcesActions.LOAD_KNOWLEDGE_SOURCES_LIST,
      });
    });
  });

  describe('Load Specific Page For Knowledge Sources List', () => {
    it('should create an action', () => {
      const payload = 'https://test.test';
      const action = new knowledgeSourcesActions.LoadSpecificPageForKnowledgeSourcesList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourcesActions.LOAD_SPECIFIC_PAGE_FOR_KNOWLEDGE_SOURCES_LIST,
      });
    });
  });

  describe('Load Knowledge Sources List Success', () => {
    it('should create an action', () => {
      const knowledgeSource1: KnowledgeSource = {} as any;
      const knowledgeSource2: KnowledgeSource = {} as any;
      const payload = {
        pagination: blankPages,
        results: [knowledgeSource1, knowledgeSource2],
      };
      const action = new knowledgeSourcesActions.LoadKnowledgeSourcesListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourcesActions.LOAD_KNOWLEDGE_SOURCES_LIST_SUCCESS,
      });
    });
  });

  describe('Load Single Knowledge Source For Knowledge Sources List', () => {
    it('should create an action', () => {
      const action = new knowledgeSourcesActions.LoadSingleKnowledgeSourceForKnowledgeSourcesList('decision1');
      expect({ ...action }).toEqual({
        payload: 'decision1',
        type: knowledgeSourcesActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST,
      });
    });
  });

  describe('Load Single Knowledge Source For Knowledge Sources List Success', () => {
    it('should create an action', () => {
      const payload = new KnowledgeSource();
      const action = new knowledgeSourcesActions.LoadSingleKnowledgeSourceForKnowledgeSourcesListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourcesActions.LOAD_SINGLE_KNOWLEDGE_SOURCE_FOR_KNOWLEDGE_SOURCES_LIST_SUCCESS,
      });
    });
  });

  describe('Remove Single Knowledge Source From Knowledge Sources List', () => {
    it('should create an action', () => {
      const payload = 'decision1';
      const action = new knowledgeSourcesActions.RemoveSingleKnowledgeSourceFromKnowledgeSourcesList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourcesActions.REMOVE_SINGLE_KNOWLEDGE_SOURCE_FROM_KNOWLEDGE_SOURCES_LIST,
      });
    });
  });

  describe('Update Search For Knowledge Sources List', () => {
    it('should create an action with an empty payload', () => {
      const action = new knowledgeSourcesActions.UpdateSearchForKnowledgeSourcesList();
      expect({ ...action }).toEqual({
        payload: '',
        type: knowledgeSourcesActions.UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST,
      });
    });

    it('should create an action', () => {
      const payload = 'abc';
      const action = new knowledgeSourcesActions.UpdateSearchForKnowledgeSourcesList(payload);
      expect({ ...action }).toEqual({
        payload,
        type: knowledgeSourcesActions.UPDATE_SEARCH_FOR_KNOWLEDGE_SOURCES_LIST,
      });
    });
  });

  describe('Knowledge Sources List Failure', () => {
    it('should create an action', () => {
      const action = new knowledgeSourcesActions.KnowledgeSourcesListFailure(new Error('a message'));
      expect({ ...action }).toEqual({
        payload: new Error('a message'),
        type: knowledgeSourcesActions.KNOWLEDGE_SOURCES_LIST_FAILURE,
      });
    });
  });
});

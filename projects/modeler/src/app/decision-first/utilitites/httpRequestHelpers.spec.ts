import { HttpHeaders } from '@angular/common/http';
import { APPLICATION_JSON_HEADER, URL_LIST_HEADER } from 'core/services';
import { Decision } from '../models/decision.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { getAddRelatedObjectRequestBody, getAddRelatedObjectRequestHeaders, getRemoveRelatedObjectRequestHeaders } from './httpRequestHelpers';

describe('getAddRelatedObjectRequestBody', () => {
  it('should return string of JSON object when relation path is comments', () => {
    const relatedObject = new Decision();
    relatedObject._links = {
      self: {
        href: 'https://'
      }
    } as any;
    const expectedResult = {...relatedObject, userId: '12345'};

    const requestBody = getAddRelatedObjectRequestBody(ObjectRelationsNames.Comments, relatedObject, '12345');
      
    expect(requestBody).toEqual(JSON.stringify(expectedResult));
  });

  it('should return relatedObject href when relation path is not comments', () => {
    const relatedObject = new Decision();
    relatedObject._links = {
      self: {
        href: 'https://'
      }
    } as any;

    const requestBody = getAddRelatedObjectRequestBody(ObjectRelationsNames.Decisions, relatedObject, '12345');
      
    expect(requestBody).toEqual(relatedObject._links.self.href);
  });
});

describe('getAddRelatedObjectRequestHeaders', () => {
  it('should return application/json content type when relation path is comments', () => {
    const requestHeaders = getAddRelatedObjectRequestHeaders(ObjectRelationsNames.Comments);

    expect(requestHeaders).toEqual(APPLICATION_JSON_HEADER);
  });

  it('should return text/uri-list content type when relation path is not comments', () => {
    const requestHeaders = getAddRelatedObjectRequestHeaders(ObjectRelationsNames.Decisions);

    expect(requestHeaders).toEqual(URL_LIST_HEADER);
  });
});

describe('getRemoveRelatedObjectRequestHeaders', () => {
  it('should return userId header when relation path is comments', () => {
    const requestHeaders = getRemoveRelatedObjectRequestHeaders(ObjectRelationsNames.Comments, '12345');

    expect(requestHeaders.get('userId')).toEqual('12345');
  });

  it('should return empty headers when relation path is not comments ', () => {
    const requestHeaders = getRemoveRelatedObjectRequestHeaders(ObjectRelationsNames.Decisions, '12345');

    expect(requestHeaders).toEqual(new HttpHeaders());
  });
});
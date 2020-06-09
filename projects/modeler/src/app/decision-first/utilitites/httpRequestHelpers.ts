import { HttpHeaders } from '@angular/common/http';
import { APPLICATION_JSON_HEADER, URL_LIST_HEADER } from 'core/services';
import { Comment } from '../models/comment.model';
import { DfmObjects, ObjectRelationsNames } from '../models/objects.model';

export function getAddRelatedObjectRequestBody(relationPath: string, relatedObject: DfmObjects | Comment, userId: string): string {
  const requestBody = relationPath === ObjectRelationsNames.Comments 
    ? JSON.stringify({...relatedObject, userId})
    : relatedObject._links.self.href;

  return requestBody;
}

export function  getAddRelatedObjectRequestHeaders(relationPath: string): HttpHeaders {
  const requestHeaders = relationPath === ObjectRelationsNames.Comments
    ? APPLICATION_JSON_HEADER
    : URL_LIST_HEADER;

  return requestHeaders;
}

export function  getRemoveRelatedObjectRequestHeaders(relationPath: string, userId: string): HttpHeaders {
  const requestHeaders = relationPath === ObjectRelationsNames.Comments 
    ? new HttpHeaders({'userId': userId}) 
    : new HttpHeaders();

  return requestHeaders;
}
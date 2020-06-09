import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { VersionInformation } from 'core/models';
import { toVersionInformation } from 'core/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY, IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE } from '../auth/auth.constants';

@Injectable()
export class VersionInformationService {
  private http: HttpClient;

  constructor(
    private externalService: ExternalService,
  ) {
    this.http = externalService.getHttp();
  }

  loadVersionInformation(): Observable<VersionInformation> {
    return this.http
      .get(`${this.externalService.getURL()}dfmInformations`,
      {
        headers: { 
          [IGNORE_AUTHENTICATION_TOKEN_HEADER_KEY]: IGNORE_AUTHENTICATION_TOKEN_HEADER_VALUE 
        }
      })
      .pipe(map((object: Object) => toVersionInformation(object)));
  }

  updateVersionInformation(versionInformation: VersionInformation): Observable<Object> {
    return this.http
      .patch(`${this.externalService.getURL()}dfmInformations`, versionInformation);
  }
}

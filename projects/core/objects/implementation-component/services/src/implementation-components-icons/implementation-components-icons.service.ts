import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { ImplementationComponentIcon, IMPLEMENTATION_COMPONENT_ICON_RELATION_NAME, UploadImplementationComponentIconRequest } from 'core/objects/implementation-component/models';
import { toImplementationComponentIcon } from 'core/objects/implementation-component/utilities';
import { CommonService } from 'core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ImplementationComponentsIconsService extends CommonService<ImplementationComponentIcon> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(ImplementationComponentIcon, IMPLEMENTATION_COMPONENT_ICON_RELATION_NAME, externalService, injector);
    this.toObject = toImplementationComponentIcon;
  }

  getImplementationComponentIcons(): Observable<ImplementationComponentIcon[]> {
    return this.externalService.getHttp()
      .get(`${this.externalService.getURL()}${this._resource}`)
      .pipe(map((object: Object[]) => object.map(toImplementationComponentIcon)));
  }

  getImplementationComponentIcon(iconId: string): Observable<ImplementationComponentIcon> {
    return this.externalService.getHttp()
      .get(`${this.externalService.getURL()}${this._resource}/${iconId}`)
      .pipe(map((object) => toImplementationComponentIcon(object)));
  }

  updateImplementationComponentIcon(icon: ImplementationComponentIcon): Observable<Object> {
    return this.externalService.getHttp()
      .patch(`${this.externalService.getURL()}${this._resource}/${icon.id}`, icon);
  }

  uploadImplementationComponentIcon(uploadIconRequest: UploadImplementationComponentIconRequest): Observable<Object> {
    const formData = new FormData();
    formData.append('name', uploadIconRequest.name);
    formData.append('tooltip', uploadIconRequest.tooltip);
    formData.append('icon', uploadIconRequest.icon);

    return this.externalService.getHttp()
      .post(`${this.externalService.getURL()}${this._resource}`, formData, { 
        responseType: 'text'
      });
  }

  deleteImplementationComponentIcon(id: string): Observable<Object> {
    return this.externalService.getHttp()
      .delete(`${this.externalService.getURL()}${this._resource}/${id}`);
  }
}

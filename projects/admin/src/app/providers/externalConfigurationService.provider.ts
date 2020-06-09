import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalConfiguration, ExternalConfigurationHandlerInterface } from 'angular4-hal';
import { Config } from '../config';

@Injectable()
export class ExternalConfigurationService implements ExternalConfigurationHandlerInterface {
  deserialize() {
    throw new Error('Method not implemented.');
  }
  serialize() {
    throw new Error('Method not implemented.');
  }
  getProxyUri(): string {
    return Config.proxyUri;
  }

  getRootUri(): string {
    return Config.rootUri;
  }

  getHttp(): HttpClient {
    return this.http;
  }

  constructor(private http: HttpClient) {}

  getExternalConfiguration(): ExternalConfiguration {
    return null;
  }

  setExternalConfiguration(externalConfiguration: ExternalConfiguration) {}
}

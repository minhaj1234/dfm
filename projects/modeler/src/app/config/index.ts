import { Injectable } from '@angular/core';
import { IConfig } from 'core/config';
import { IConfigMap } from './configMap';
import { devConfig } from './devConfig.map';
import { demoConfig } from './demoConfig.map';
import { getWindow } from './getWindow';
import { localConfig } from './localConfig.map';
import { prodConfig } from './prodConfig.map';

export function staticConfig<T extends IConfig>(constructor: T) {
  return constructor;
}

@Injectable()
@staticConfig
export class Config {
  private static get environmentConfig(): IConfigMap {
    const devUrl = 'dev.modeler2.decisionsfirst.com';
    const demoUrl = 'demo.modeler2.decisionsfirst.com';
    const prodUrl = 'modeler2.decisionsfirst.com';

    switch (getWindow().location.hostname) {
      case devUrl:
        return devConfig;
      case demoUrl:
        return demoConfig;
      case prodUrl:
        return prodConfig;
      default:
        return localConfig;
    }
  }

  public static get proxyUri(): string {
    return this.environmentConfig.proxyUri;
  }

  public static get rootUri(): string {
    return this.environmentConfig.rootUri;
  }

  public static get environment(): string {
    return this.environmentConfig.environment;
  }

  public static get defaultLanguageCode(): string {
    return 'en';
  }

  public static get pageSize(): number {
    return 10;
  }

  public static get debounceTime(): number {
    return 5000;
  }

  public static get searchDebounceTime(): number {
    return 250;
  }

  public static get goJsLicenseKey(): string {
    return '2bf843e6b06758c511d35a25403f7efb0ff72d66ce804da05a5117a3ed0d61442698e12d55d48cc0d3fe48a91c7f93d1d9c33e7e855c0368b461d2df13b2d2abb06477b61d0a438ead0023909efb2ba1fb7b71a791b573aa8d2a8ffbecaacace09b8f6dc1bce0eb8287b03620677bd5ab1ae897df9509c4e797d9ba6fae0b049f973778c';
  }

  public static get autocompleteListPageSize(): number {
    return 3;
  }

  public static get environmentName(): string {
    return this.environmentConfig.name;
  }
}

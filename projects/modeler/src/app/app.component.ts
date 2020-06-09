import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as go from 'gojs';
import { Config } from './config';

@Component({
  selector: 'dfm-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.setGoJsLicenseKey();
    this.setDefaultLanguage();
  }

  setGoJsLicenseKey(): void {
    (go as any).licenseKey = Config.goJsLicenseKey;
  }

  setDefaultLanguage(): void {
    const languageCode = localStorage.getItem('languageCode');
    this.translateService.setDefaultLang(languageCode ? languageCode : Config.defaultLanguageCode);
  }
}

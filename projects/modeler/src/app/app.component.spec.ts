import { APP_BASE_HREF } from '@angular/common';
import { async, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'core/root-store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useValue: { scheduleRenewal() {} } },
      ],
    }).compileComponents();

    translateService = TestBed.get(TranslateService);
    spyOn(translateService, 'setDefaultLang');
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should set default language code', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(translateService.setDefaultLang).toHaveBeenCalled();
  });

  it('should set language code from local storage', () => {
    const store = { languageCode: 'jp' };
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      return store[key];
    });

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('jp');
  });
});

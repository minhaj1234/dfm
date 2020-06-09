import { TestBed } from '@angular/core/testing';
import { NbThemeModule, NbToastrModule, NbToastrService } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as KeyCode from 'keycode-js';
import { KeyboardService } from './keyboard.service';

describe('KeyboardService', () => {
  let service: KeyboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbToastrModule.forRoot(), NbThemeModule.forRoot(), TranslateModule.forRoot()],
      providers: [KeyboardService, NbToastrService, TranslateService],
    });
    service = TestBed.get(KeyboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isDisplayedCharacter', () => {
    it('should return true if key is letter', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_A)).toBeTruthy();
    });

    it('should return true if key is number', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_0)).toBeTruthy();
    });

    it('should return true if key is numpad number', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_NUMPAD3)).toBeTruthy();
    });

    it('should return true if key is special symbol', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_COMMA)).toBeTruthy();
    });

    it('should return true if key is special numpad symbol', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_MULTIPLY)).toBeTruthy();
    });

    it('should return true if key is Enter', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_RETURN)).toBeTruthy();
    });

    it('should return true if key is Space', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_SPACE)).toBeTruthy();
    });

    it('should return false if key is not displayed symbol', () => {
      expect(service.isDisplayedCharacter(KeyCode.KEY_TAB)).toBeFalsy();
    });
  });
});

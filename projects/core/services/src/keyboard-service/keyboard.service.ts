import { Injectable } from '@angular/core';
import * as KeyCode from 'keycode-js';
import { SymbolsCodeRange } from './keyboard-service.constant';

@Injectable()
export class KeyboardService {
	isLetter(keyCode: number): boolean {
		return keyCode >= SymbolsCodeRange.ALPHABET_START && keyCode <= SymbolsCodeRange.ALPHABET_END;
	}

	isNumber(keyCode: number): boolean {
		return (keyCode >= SymbolsCodeRange.NUMBERS_START && keyCode <= SymbolsCodeRange.NUMBERS_END) ||
			(keyCode >= SymbolsCodeRange.NUMPAD_NUMBERS_START && keyCode <= SymbolsCodeRange.NUMPAD_NUMBERS_END);
	}

	isSpecialSymbol(keyCode: number): boolean {
		return (keyCode >= SymbolsCodeRange.SPECIAL_SYMBOLS_START && keyCode <= SymbolsCodeRange.SPECIAL_SYMBOLS_END) ||
			(keyCode >= SymbolsCodeRange.NUMPAD_SPECIAL_SYMBOLS_START && keyCode <= SymbolsCodeRange.NUMPAD_SPECIAL_SYMBOLS_END);
	}

	isDisplayedCharacter(keyCode: number): boolean {
		return this.isLetter(keyCode) ||
			this.isNumber(keyCode) ||
			this.isSpecialSymbol(keyCode) || 
			keyCode === KeyCode.KEY_RETURN ||
			keyCode === KeyCode.KEY_SPACE;
  }
}

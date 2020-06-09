import { forwardRef, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import { KeyboardService, MessageService } from 'core/services';
import * as KeyCode from 'keycode-js';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { CONTAINER_VERTICAL_PADDDING, LAST_EMPTY_ROW, MaxTextLengthCategory, ROW_HEIGHT } from './edit-multiple-lines-control.const';

@Component({
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditMultipleLinesControlComponent),
    },
  ],
  selector: 'core-edit-multiple-lines-control',
  styleUrls: ['./edit-multiple-lines-control.component.scss'],
  templateUrl: './edit-multiple-lines-control.component.html',
})
export class EditMultipleLinesControlComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  public quill: any;
  @Input() maxTextLength = MaxTextLengthCategory.ShortText;
  @Input() isRichEditor = true;
  @Input() rows = 1;
  @Input() isReadOnly: boolean;
  @Input() isSingleLine = false;
  @ViewChild(ContextMenuComponent, { static: true }) public editorContextMenu: ContextMenuComponent;
  public form: FormGroup;
  private sendChanges = true;
  private onChange: any = () => {};
  private onTouch: any = () => {};

  set editorValue(val: string) {
    if (this.sendChanges) {
      this.onChange(val);
    }
  }

  constructor (
    private formBuilder: FormBuilder, 
    private renderer: Renderer2,
    private messageService: MessageService,
    private keyboardService: KeyboardService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      editor: [''],
    });
  }

  ngAfterViewInit() {
    this.disableFocusableForSVG();
  }

  // https://github.com/angular/material/issues/7250
  disableFocusableForSVG(): void {
    const elements = document.querySelectorAll('svg');
    for (let i=0; i < elements.length; i++) {
      this.renderer.setAttribute(elements[i], "focusable", "false");
    }
  }

  writeValue(value: string): void {
    this.sendChanges = false;
    const content = (value || '') + LAST_EMPTY_ROW;
    if (this.quill && this.quill.hasFocus()) {
      this.setValueWithCursorPosition(content);
    } else {
      this.setValue(content);
    }
    this.sendChanges = true;
  }

  setValueWithCursorPosition(value: string): void {
    const range = this.quill.getSelection();

    this.setValue(value);
    this.quill.setSelection(range ? range.index : this.quill.getText().length);
  }

  setValue(value: string): void {
    this.form.controls['editor'].setValue(value);
  }

  onEditorCreated(editor: any): void {
    this.quill = editor;
    this.removeKeyBindings();
    this.subscribeToFocus();
    this.subscribeToBlur();
    this.subscribeToInput();
  }

  removeKeyBindings(): void {
    const keyboardModule = this.quill.getModule('keyboard');
    delete keyboardModule.bindings[KeyCode.KEY_TAB];
    delete keyboardModule.bindings[KeyCode.KEY_RETURN];
  }

  subscribeToFocus(): void {
    this.quill.container.addEventListener('click', () => {
      this.quill.focus();
    });
    this.quill.root.addEventListener('focus', () => {
      this.onFocus();
    });
  }

  subscribeToBlur(): void {
    this.quill.root.addEventListener('blur', () => {
      this.onBlur();
      this.markAsTouched();
    });
  }

  markAsTouched(): void {
    this.changeDetectorRef.markForCheck();
    this.onTouch();
  }

  onBlur(): void {
    this.renderer.removeClass(this.quill.container, 'rich-text-editor-focus');
  }

  onFocus(): void {
    this.renderer.addClass(this.quill.container, 'rich-text-editor-focus');
  }

  subscribeToInput(): void {
    this.subscribeToKeydown();
    this.subscribeToPaste();
  }

  subscribeToKeydown(): void {
    this.quill.container.addEventListener('keydown', (event) => {
      const quillTextLenght = this.quill.getText().length;
      
      if (!event.ctrlKey && quillTextLenght > this.maxTextLength && this.keyboardService.isDisplayedCharacter(event.keyCode)) {
        this.showWarning();
        event.preventDefault();
      }

      if (this.isSingleLine && event.keyCode === KeyCode.KEY_RETURN) {
        event.preventDefault();
      }
    });
  }

  subscribeToPaste(): void {
    this.quill.container.addEventListener('paste', (event) => {
      const text: string = event.clipboardData.getData('text');
      const quillTextLenghtWithoutNextLineSymbol = this.quill.getText().length -1;

      if (quillTextLenghtWithoutNextLineSymbol + text.length > this.maxTextLength) {
        this.showWarning();
        event.preventDefault();
      }

      if (this.isSingleLine && /\n/.test(text)) {
        event.preventDefault();
      }
    });
  }

  showWarning(): void {
    this.messageService.showWarning(['resources.theMaxLengthIs', " ", `${this.maxTextLength}`], 'resources.maximumLengthReached')
  }
  
  onContentChanged(event): void {
    const content = this.isRichEditor ? event.html : this.removeNewLine(event.text);
    this.editorValue = content || '';
  }

  removeNewLine(text: string): string {
    return text.slice(0, text.length - 1)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(value: boolean): void {
    this.isReadOnly = value;
  }

  formatText(name: string, value: string): void {
    const range = this.quill.getSelection();
    if (range && range.length > 0) {
      this.setFormatText(range, name, value);
    }
  }

  formatLine(name: string, value: string): void {
    const range = this.quill.getSelection();
    if (range) {
      this.setFormatLine(range, name, value);
    }
  }

  setFormatText(range: any, name: string, value: string): void {
    const formatValue = this.checkFormatValue(name, value) ? false : value;
    this.quill.formatText(range.index, range.length, name, formatValue);
  }

  setFormatLine(range: any, name: string, value: string): void {
    const formatValue = this.checkFormatValue(name, value) ? false : value;
    this.quill.formatLine(range.index, range.length, name, formatValue);
  }

  checkFormatValue(name: string, value: string): boolean {
    const textFormat = this.quill.getFormat();
    return textFormat[name] && textFormat[name].toString() === value;
  }

  getMinHeight(): string {
    return `${this.rows*ROW_HEIGHT + 2*CONTAINER_VERTICAL_PADDDING}px`;
  }
}

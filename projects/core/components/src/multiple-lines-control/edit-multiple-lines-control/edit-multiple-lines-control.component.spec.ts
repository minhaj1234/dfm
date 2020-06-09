import { ChangeDetectorRef, Directive, EventEmitter, Renderer2, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogRef, NbDialogService, NbThemeModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeyboardService, MessageService } from 'core/services';
import { triggerClipboardEvent, triggerKeyDown, FakeMessageService } from 'core/testing';
import { NbDialogRefMock } from 'core/testing';
import * as KeyCode from 'keycode-js';
import { ContextMenuModule, ContextMenuService } from 'ngx-contextmenu';
import { QuillModule } from 'ngx-quill';
import { EditMultipleLinesControlComponent } from './edit-multiple-lines-control.component';

class Quill {
  getFormat() {}

  getSelection() {}

  setFormatLine() {}
}

export function MockDirective(options: Directive): Directive {
  class Mock {}

  const metadata: Directive = {
    exportAs: options.exportAs || '',
    inputs: options.inputs || [],
    outputs: options.outputs || [],
    selector: options.selector,
  };

  metadata.outputs.forEach((method) => {
    Mock.prototype[method] = new EventEmitter<any>();
  });

  return Directive(metadata)(Mock as any);
}

describe('EditMultipleLinesControlComponent', () => {
  let component: EditMultipleLinesControlComponent;
  let fixture: ComponentFixture<EditMultipleLinesControlComponent>;
  let quillGetFormatSpy: jasmine.Spy;
  let quillGetSelectionSpy: jasmine.Spy;
  let renderer: Renderer2;
  
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [EditMultipleLinesControlComponent, MockDirective({ selector: '[matTooltip]' })],
      imports: [
        FormsModule,
        ContextMenuModule,
        ReactiveFormsModule,
        QuillModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        NbThemeModule.forRoot(),
        NgbModule,
      ],
      providers: [
        NbDialogService, 
        ContextMenuService,
        KeyboardService, 
        ChangeDetectorRef,
        { provide: MessageService, useValue: new FakeMessageService() },
        { provide: NbDialogRef, useClass: NbDialogRefMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleLinesControlComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component.quill = new Quill();
    fixture.detectChanges();

    spyOn(component.quill, 'formatLine');
    spyOn(component.quill, 'formatText');
    quillGetSelectionSpy = spyOn(component.quill, 'getSelection');
    quillGetFormatSpy = spyOn(component.quill, 'getFormat').and.returnValue({});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatText', () => {
    it('should call setFormatText', () => {
      spyOn(component, 'setFormatText');
      quillGetSelectionSpy.and.returnValue({ index: 0, length: 1 });

      component.formatText('bold', 'true');

      expect(component.setFormatText).toHaveBeenCalled();
    });

    it('should not call setFormatText', () => {
      spyOn(component, 'setFormatText');
      quillGetSelectionSpy.and.returnValue({ index: 0, length: 0 });

      component.formatText('bold', 'true');

      expect(component.setFormatText).not.toHaveBeenCalled();
    });
  });

  describe('formatLine', () => {
    it('should call setFormatLine', () => {
      spyOn(component, 'setFormatLine');
      quillGetSelectionSpy.and.returnValue({ index: 0, length: 1 });

      component.formatLine('list', 'bullet');

      expect(component.setFormatLine).toHaveBeenCalled();
    });

    it('should not call setFormatLine', () => {
      spyOn(component, 'setFormatLine');
      quillGetSelectionSpy.and.returnValue(null);

      component.formatLine('list', 'bullet');

      expect(component.setFormatLine).not.toHaveBeenCalled();
    });
  });

  describe('setFormatText', () => {
    [
      {
        isFormatNameExists: false,
        name: 'name',
        range: { index: 0, length: 0 },
        value: 'passed value',
      },
      {
        isFormatNameExists: true,
        name: 'name',
        range: { index: 0, length: 0 },
        value: false,
      },
    ].forEach((item) => {
      it(`should call quill formatText with ${item.value}`, () => {
        spyOn(component, 'checkFormatValue').and.returnValue(item.isFormatNameExists);

        component.setFormatText(item.range, item.name, item.value.toString());

        expect(component.quill.formatText).toHaveBeenCalledWith(
          item.range.index,
          item.range.length,
          item.name,
          item.value,
        );
      });
    });
  });

  describe('setFormatLine', () => {
    [
      {
        isFormatNameExists: false,
        name: 'name',
        range: { index: 0, length: 0 },
        value: 'passed value',
      },
      {
        isFormatNameExists: true,
        name: 'name',
        range: { index: 0, length: 0 },
        value: false,
      },
    ].forEach((item) => {
      it(`should call quill formatLine with ${item.value}`, () => {
        spyOn(component, 'checkFormatValue').and.returnValue(item.isFormatNameExists);

        component.setFormatLine(item.range, item.name, item.value.toString());

        expect(component.quill.formatLine).toHaveBeenCalledWith(
          item.range.index,
          item.range.length,
          item.name,
          item.value,
        );
      });
    });
  });

  describe('checkFormatValue', () => {
    [
      {
        format: { name: 'value' },
        name: 'name',
        returnValue: false,
        value: 'new value',
      },
      {
        format: { name: 'value' },
        name: 'name',
        returnValue: true,
        value: 'value',
      },
    ].forEach((item) => {
      it(`should return ${item.returnValue}`, () => {
        quillGetFormatSpy.and.returnValue(item.format);

        const returnValue = component.checkFormatValue(item.name, item.value);

        expect(returnValue).toBe(item.returnValue);
      });
    });
  });

  describe('setValueWithCursorPosition', () => {
    it('should call setValue', () => {
      spyOn(component, 'setValue');

      component.setValueWithCursorPosition('new value');

      expect(component.setValue).toHaveBeenCalled();
    });

    it('should call quill setSelection and set the cursor at the beginning', () => {
      const text = 'some text';
      spyOn(component.quill, 'setSelection');
      spyOn(component.quill, 'getText').and.returnValue(text);
      quillGetSelectionSpy.and.returnValue(null);

      component.setValueWithCursorPosition('new value');

      expect(component.quill.setSelection).toHaveBeenCalledWith(text.length);
    });

    it('should call quill setSelection and set the cursor on the some place', () => {
      const range = { index: 0 };
      spyOn(component.quill, 'setSelection');
      quillGetSelectionSpy.and.returnValue(range);

      component.setValueWithCursorPosition('new value');

      expect(component.quill.setSelection).toHaveBeenCalledWith(range.index);
    });
  });

  describe('writeValue', () => {
    it('should call setValueWithCursorPosition', () => {
      spyOn(component.quill, 'hasFocus').and.returnValue(true);
      spyOn(component, 'setValueWithCursorPosition');

      component.writeValue('new value');

      expect(component.setValueWithCursorPosition).toHaveBeenCalled();
    });

    it('should call setValue', () => {
      spyOn(component.quill, 'hasFocus').and.returnValue(false);
      spyOn(component, 'setValueWithCursorPosition');

      component.writeValue('new value');

      expect(component.setValueWithCursorPosition).not.toHaveBeenCalled();
    });
  });

  describe('click event', () => {
    it('should focus editor', () => {
      spyOn(component.quill, 'focus');
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');
      
      editor.dispatchEvent(new Event('click'));
      
      expect(component.quill.focus).toHaveBeenCalled();
    });
  });
  
  describe('focus event', () => {
    it('should add class', () => {
      spyOn(renderer, 'addClass');
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-editor');
      
      editor.dispatchEvent(new Event('focus'));
      
      expect(renderer.addClass).toHaveBeenCalledWith(component.quill.container, 'rich-text-editor-focus');
    });
  });

  describe('blur event', () => {
    it('should remove class', () => {
      spyOn(renderer, 'removeClass');
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-editor');
      
      editor.dispatchEvent(new Event('blur'));
      
      expect(renderer.removeClass).toHaveBeenCalledWith(component.quill.container, 'rich-text-editor-focus');
    });
  });

  describe('prevent keydown event', () => {
    beforeEach(() => {
      component.maxTextLength = 4;
      component.quill.setText('text');
    });

    it('should prevent event when max text lenght is reached', () => {
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');
     
      const event = triggerKeyDown(editor, KeyCode.KEY_A);
      
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('do not prevent keydown  event', () => {
    beforeEach(() => {
      component.maxTextLength = 4;
      component.quill.setText('text');
    });

    it('should not prevent event when max text lenght is not reached', () => {
      component.maxTextLength = 5;
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');

      const event = triggerKeyDown(editor, KeyCode.KEY_A);
      
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should not prevent event when control is pressed', () => {
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');
      
      const event = triggerKeyDown(editor, KeyCode.KEY_A, true);
      
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should not prevent event when system key is pressed', () => {
      const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');

      const event = triggerKeyDown(editor, KeyCode.KEY_TAB);
      
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('paste event', () => {
    beforeEach(() => {
      component.maxTextLength = 4;
      component.quill.setText('text');
    });

    describe('prevent paste event', () => {
      it('should prevent event when max text length is reached', () => {
        const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');
        
        const event = triggerClipboardEvent(editor, 'Paste text');
        
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('do not prevent paste event', () => {
      it('should not prevent event when max text length is not reached', () => {
        component.maxTextLength = 14;
        const editor = fixture.debugElement.nativeElement.querySelector('.ql-container');
        
        const event = triggerClipboardEvent(editor, 'Paste text');
        
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeNewLine', () => {
    it('should remove new line at the end of the text', () => {
      expect(component.removeNewLine('\ntext\n')).toEqual('\ntext');
    });
  });
});

import * as go from "gojs";
import * as KeyCode from 'keycode-js';
import { createCustomTextEditor } from './go-js-text-editor';

describe('createCustomTextEditor', () => {
    const invalidBorderColor = 'red';
    const invalidOutlineWidth = '0px';

    describe('Given the editor is created', () => {
        let editor: go.HTMLInfo;
        beforeEach(() => {
            editor = createCustomTextEditor();
        });

        describe('show', () => {
            it('should be defined', () => {
                expect(editor.show).toBeDefined();
            });

            describe('Given a diagram, a text block and a drawing tool', () => {
                let diagram: go.Diagram;
                let textBlock: go.TextBlock;
                let tool: go.Tool;
                let textBlockActualBounds: jasmine.Spy;
                let textBlockLineCount: jasmine.Spy;
                beforeEach(() => {
                    ({ diagram, textBlockActualBounds, textBlockLineCount, textBlock, tool } = mockGoJsContext());
                });

                it('should append a single textarea to diagram.div', () => {
                    editor.show(textBlock, diagram, tool);

                    expect(diagram.div.children.length).toEqual(1);
                    const childElement = diagram.div.children[0];
                    expect(childElement as HTMLTextAreaElement).toBeTruthy();
                });

                it('should set textarea size according to text block size', () => {
                    const sampleLineCount = 7;
                    const sampleWidth = 137;
                    const rectWithSampleWidth = new go.Rect(new go.Point(0, 0), new go.Size(sampleWidth, 1));
                    textBlockLineCount.and.returnValue(sampleLineCount);
                    textBlockActualBounds.and.returnValue(rectWithSampleWidth);

                    editor.show(textBlock, diagram, tool);

                    const childElement = diagram.div.children[0];
                    expect(childElement.getAttribute('rows')).toEqual(sampleLineCount.toString());
                    expect((childElement as HTMLTextAreaElement).style.width).toEqual(sampleWidth + 'px');
                });

                it('should set textarea location according to text block location', () => {
                    const sampleLocation = new go.Point(42, 69);
                    (<any>diagram).transformDocToView.and.returnValue(sampleLocation);

                    editor.show(textBlock, diagram, tool);

                    const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                    expect(childElement.style.left).toEqual(sampleLocation.x + 'px');
                    expect(childElement.style.top).toEqual(sampleLocation.y + 'px');
                });

                it('should set textarea style properly', () => {
                    editor.show(textBlock, diagram, tool);

                    const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                    expect(childElement.style.resize).toEqual('none');
                    expect(childElement.style.position).toEqual('absolute');
                    expect(childElement.style.zIndex).toEqual('100');
                });

                it('should not set the border style of textarea to invalid state', () => {
                    editor.show(textBlock, diagram, tool);

                    const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                    expect(childElement.style.borderColor).not.toEqual(invalidBorderColor);
                    expect(childElement.style.outlineWidth).not.toEqual(invalidOutlineWidth);
                });

                it('should not duplicate textarea if called twice', () => {
                    editor.show(textBlock, diagram, tool);
                    editor.show(textBlock, diagram, tool);

                    expect(diagram.div.children.length).toEqual(1);
                });
            });
        });

        describe('hide', () => {
            it('should be defined', () => {
                expect(editor.hide).toBeDefined();
            });

            describe('Given show was called', () => {
                let diagram: go.Diagram;
                let textBlock: go.TextBlock;
                let tool: go.Tool;
                beforeEach(() => {
                    ({ diagram, textBlock, tool } = mockGoJsContext());
                    editor.show(textBlock, diagram, tool);
                });

                it('should remove the element from diagram.div', () => {
                    editor.hide(diagram, tool);

                    expect(diagram.div.children.length).toEqual(0);
                });
            });
        });

        describe('onkeydown', () => {
            describe('Given show was called', () => {
                let diagram: go.Diagram;
                let textBlock: go.TextBlock;
                let tool: go.Tool;
                let mockValidationResult: boolean;
                let textBlockValidationSpy: jasmine.Spy;
                beforeEach(() => {
                    ({ diagram, textBlock, tool } = mockGoJsContext());
                    textBlockValidationSpy = spyOn(textBlock, 'textValidation').and.callFake((tb, oldstr, newstr) => mockValidationResult)
                    mockValidationResult = true;
                    editor.show(textBlock, diagram, tool);
                });

                describe('Given a value was written in', () => {
                    const sampleValue = 'sampleValue';
                    beforeEach(() => {
                        const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                        childElement.value = sampleValue;
                    });

                    it('should validate the value when a key is pressed', () => {
                        const childElement = diagram.div.children[0] as HTMLTextAreaElement;

                        triggerKeyDown(childElement, KeyCode.KEY_A)

                        expect(textBlockValidationSpy).toHaveBeenCalled();
                    });

                    describe('Given the valid value changed to invalid', () => {
                        beforeEach(() => {
                            mockValidationResult = true;
                            const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                            triggerKeyDown(childElement, KeyCode.KEY_A);
                            mockValidationResult = false;
                        });

                        it('textarea should be set to invalid style when a key is pressed', () => {
                            const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                            triggerKeyDown(childElement, KeyCode.KEY_A);
                            
                            expect(childElement.style.borderColor).toEqual(invalidBorderColor);
                            expect(childElement.style.outlineWidth).toEqual(invalidOutlineWidth);
                        });

                        const checkEnterOrTabBehavior = (keyboardEvent:() => KeyboardEvent) => {
                            it('should not call acceptText on go-js tool', () => {
                                expect((<any>tool).acceptText).not.toHaveBeenCalled();
                            });

                            it('should prevent default event behavior', () => {
                                expect(keyboardEvent().preventDefault).toHaveBeenCalled();
                            });
                        }

                        describe('Given Enter was pressed', () => {
                            let keyboardEvent: KeyboardEvent;
                            beforeEach(() => {
                                const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                                (<any>tool).acceptText.calls.reset();
                                keyboardEvent = triggerKeyDown(childElement, KeyCode.KEY_RETURN);
                            });

                            checkEnterOrTabBehavior(() => keyboardEvent);
                        });

                        
                        describe('Given Tab was pressed', () => {
                            let keyboardEvent: KeyboardEvent;
                            beforeEach(() => {
                                const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                                (<any>tool).acceptText.calls.reset();
                                keyboardEvent = triggerKeyDown(childElement, KeyCode.KEY_TAB);
                            });

                            checkEnterOrTabBehavior(() => keyboardEvent);
                        });
                    });

                    describe('Given the invalid value changed to valid', () => {
                        beforeEach(() => {
                            mockValidationResult = false;
                            const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                            triggerKeyDown(childElement, KeyCode.KEY_A);
                            mockValidationResult = true;
                        });

                        it('textarea should not be set to invalid state when a key is pressed', () => {
                            const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                            triggerKeyDown(childElement, KeyCode.KEY_A);

                            expect(childElement.style.borderColor).not.toEqual(invalidBorderColor);
                            expect(childElement.style.outlineWidth).not.toEqual(invalidOutlineWidth);
                        });

                        const checkEnterOrTabBehavior = (keyboardEvent:() => KeyboardEvent) => {
                            it('should call acceptText on go-js tool', () => {
                                expect((<any>tool).acceptText).toHaveBeenCalled();
                            });

                            it('should prevent default event behavior', () => {
                                expect(keyboardEvent().preventDefault).toHaveBeenCalled();
                            });
                        }

                        describe('Given Enter was pressed', () => {
                            let keyboardEvent: KeyboardEvent;
                            beforeEach(() => {
                                const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                                (<any>tool).acceptText.calls.reset();
                                keyboardEvent = triggerKeyDown(childElement, KeyCode.KEY_RETURN);
                            });

                            checkEnterOrTabBehavior(() => keyboardEvent);
                        });

                        
                        describe('Given Tab was pressed', () => {
                            let keyboardEvent: KeyboardEvent;
                            beforeEach(() => {
                                const childElement = diagram.div.children[0] as HTMLTextAreaElement;
                                (<any>tool).acceptText.calls.reset();
                                keyboardEvent = triggerKeyDown(childElement, KeyCode.KEY_TAB);
                            });

                            checkEnterOrTabBehavior(() => keyboardEvent);
                        });
                    });
                });
            });
        });
    });
});

function mockGoJsContext() {
    const diagramSpy = jasmine.createSpyObj(['transformDocToView']);
    diagramSpy.div = document.createElement('div');
    diagramSpy.transformDocToView.and.callFake(point => point);
    const diagram = diagramSpy;

    const textBlockSpy = new go.TextBlock() as any;
    spyOn(textBlockSpy, 'getDocumentPoint').and.callFake(point => point);
    const textBlockActualBounds = spyOnProperty(textBlockSpy, 'actualBounds').and.returnValue(new go.Rect());
    const textBlockLineCount = spyOnProperty(textBlockSpy, 'lineCount').and.returnValue(1);
    const textBlock = textBlockSpy;

    const toolSpy = jasmine.createSpyObj(['acceptText', 'doCancel']);
    const tool = <go.Tool>toolSpy;

    return { diagram, textBlockActualBounds, textBlockLineCount, textBlock, tool }
}

function triggerKeyDown(target: HTMLElement, key: number): KeyboardEvent {
    const keydownEvent = document.createEvent('KeyboardEvent');
    keydownEvent.initEvent('keydown');
    spyOn(keydownEvent, 'preventDefault');
    spyOnProperty(keydownEvent, 'which').and.returnValue(key);
    target.dispatchEvent(keydownEvent);
    return keydownEvent;
}
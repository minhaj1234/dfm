import * as go from 'gojs';
import * as KeyCode from 'keycode-js';

interface TextEditor {
  editorElement: HTMLTextAreaElement,
  isValid: boolean,
  isHidden: boolean
}

export function createCustomTextEditor(): go.HTMLInfo {
  const textEditor: TextEditor = {
    editorElement: createEditorElement(),
    isValid: true,
    isHidden: true
  };

  const customEditor = new go.HTMLInfo();

  customEditor.show = (textBlock, diagram, tool) => {
    showEditor(textEditor, textBlock, diagram, tool as go.TextEditingTool);
  };

  customEditor.hide = (diagram, tool) => {
    hideEditor(textEditor, diagram);
  };

  customEditor.valueFunction = () => textEditor.editorElement.value;
  return customEditor;
};

function createEditorElement(): HTMLTextAreaElement {
  const customInput = document.createElement('textarea');
  customInput.style.resize = 'none';
  customInput.style.position = 'absolute';
  customInput.style.zIndex = (100).toString();

  return customInput;
}

function showEditor(textEditor: TextEditor, textBlock: go.GraphObject, diagram: go.Diagram, tool: go.TextEditingTool): void {
  if (!(textBlock instanceof go.TextBlock)) {
    return;
  }

  if (!textEditor.isHidden) {
    return;
  }

  textEditor.isValid = true;
  textEditor.isHidden = false;
  
  textEditor.editorElement.addEventListener('blur', (e) => onBlur(textEditor, textBlock), false);
  textEditor.editorElement.addEventListener('keydown', (e) => onKeyDown(e, textEditor, textBlock, tool), false);

  placeEditorElement(textEditor.editorElement, textBlock, diagram);
  updateBorderStyle(textEditor);
}

function placeEditorElement(editorElement: HTMLTextAreaElement, textBlock: go.TextBlock, diagram: go.Diagram): void {
  editorElement.value = textBlock.text;
  editorElement.style.font = textBlock.font;
  editorElement.setAttribute('rows', textBlock.lineCount.toString());
  
  const locationInDocument = textBlock.getDocumentPoint(go.Spot.TopLeft);
  const locationInContainer = diagram.transformDocToView(locationInDocument);
  const size = textBlock.actualBounds;

  editorElement.style.left = locationInContainer.x + 'px';
  editorElement.style.top = locationInContainer.y + 'px';
  editorElement.style.width = size.right + 'px';

  if (diagram.div !== null){ 
    diagram.div.appendChild(editorElement);
  }

  editorElement.focus();
}

function updateBorderStyle(textEditor: TextEditor): void {
  if (!textEditor.isValid) {
    textEditor.editorElement.style.borderColor = 'red';
    textEditor.editorElement.style.outlineWidth = '0';
  } else {
    textEditor.editorElement.style.borderColor = 'initial';
    textEditor.editorElement.style.outlineWidth = 'initial';
  }
}

function hideEditor(textEditor: TextEditor, diagram: go.Diagram): void {
  if (diagram.div !== null) {
    diagram.div.removeChild(textEditor.editorElement);
  }
  
  textEditor.isHidden = true;
}

function onKeyDown(event: KeyboardEvent, textEditor: TextEditor, textBlock: go.TextBlock, tool: go.TextEditingTool): void {
  textEditor.isValid = textBlock.textValidation(textBlock, textBlock.text, textEditor.editorElement.value);
  const keynum = event.which;
  updateBorderStyle(textEditor);

  if (keynum === KeyCode.KEY_RETURN || keynum === KeyCode.KEY_TAB) {
    if (textEditor.isValid) {
      tool.acceptText(go.TextEditingTool.Tab);
    }

    event.preventDefault();
  } else if (keynum === KeyCode.KEY_ESCAPE) {
    tool.doCancel();
    if (tool.diagram) tool.diagram.focus();
  }
}

function onBlur(textEditor: TextEditor, textBlock: go.TextBlock): void {
  textEditor.isValid = textBlock.textValidation(textBlock, textBlock.text, textEditor.editorElement.value);
  updateBorderStyle(textEditor);
}
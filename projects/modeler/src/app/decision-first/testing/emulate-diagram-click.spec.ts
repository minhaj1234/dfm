import * as go from 'gojs';
import { Robot } from 'gojs/extensionsTS/Robot';

export function emulateDiagramClick(diagram: go.Diagram, x: number, y: number, clickCount: number): void {
  const robot = new Robot(diagram);
  robot.mouseDown(x + 1, y + 10, 0, { clickCount: clickCount });
  robot.mouseUp(x + 1, y + 10, 1, { clickCount: clickCount });
}
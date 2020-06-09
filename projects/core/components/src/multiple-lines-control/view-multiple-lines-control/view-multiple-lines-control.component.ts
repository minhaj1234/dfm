import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-view-multiple-lines-control',
  templateUrl: './view-multiple-lines-control.component.html',
  styleUrls: ['./view-multiple-lines-control.component.scss']
})
export class ViewMultipleLinesControlComponent {
  private _text = '';
  @Input() set text(text: string) {
    this._text = text;
  };

  get text(): string {
    const text = (this._text || '')
      .replace(new RegExp('<li>', 'g'), '<li><p>')
      .replace(new RegExp('</li>', 'g'), '</p></li>');

    return text;
  }
}

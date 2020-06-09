import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-palettes-diagram-container',
  styleUrls: ['./palettes-diagram-container.component.scss'],
  templateUrl: './palettes-diagram-container.component.html',
})
export class PalettesDiagramContainerComponent implements OnInit {
  @Input() diagram;
  @Input() existingObjects;

  constructor() {}

  ngOnInit() {}
}

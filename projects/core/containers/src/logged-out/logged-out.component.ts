import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-logged-out',
  styleUrls: ['./logged-out.component.scss'],
  templateUrl: './logged-out.component.html',
})
export class LoggedOutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

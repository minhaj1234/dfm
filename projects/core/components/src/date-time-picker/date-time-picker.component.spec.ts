import { Component, Input } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createTestComponentFactory, Spectator } from '@netbasal/spectator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DateTimePickerComponent } from './date-time-picker.component';

@Component({
  template: `<core-date-time-picker [(ngModel)]="dateTime"></core-date-time-picker>`,
})
class TestDateTimePickerComponent {
  @Input() dateTime: Date;
}
describe('DateTimePickerComponent', () => {
  let spectator: Spectator<TestDateTimePickerComponent>;
  const testDateTime = new Date(2019, 1, 1, 1, 0, 0, 0);

  const createComponent = createTestComponentFactory({
    component: TestDateTimePickerComponent,
    declarations: [DateTimePickerComponent],
    imports: [FormsModule, ReactiveFormsModule, NgbModule, TranslateModule.forRoot()],
  });

  it('should create', async(() => {
    spectator = createComponent({ dateTime: testDateTime });

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      expect(spectator.component).toBeTruthy();
    });
  }));

  it('should correct clear datetime', async(() => {
    spectator = createComponent({ dateTime: testDateTime });

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      expect(spectator.component.dateTime).toBe(testDateTime);
      spectator.query('#removeIcon').dispatchEvent(new MouseEvent('click'));
      expect(spectator.component.dateTime).toBe(null);
    });
  }));

  it('should open and close ngb-datepicker', async(() => {
    spectator = createComponent({ dateTime: testDateTime });

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      const datepickerInput = spectator.query('.datePicker');
      datepickerInput.dispatchEvent(new MouseEvent('click'));
      expect(spectator.query('ngb-datepicker')).toBeTruthy();
      datepickerInput.dispatchEvent(new MouseEvent('click'));
      expect(spectator.query('ngb-datepicker')).not.toBeTruthy();
    });
  }));

  it('should correct set default time after click meridian button', () => {
    spectator = createComponent({ dateTime: null });
    spectator.detectChanges();
    spectator.query('.ngb-tp-meridian > button').dispatchEvent(new MouseEvent('click'));
    const currentDate = new Date();
    expect(spectator.component.dateTime).toEqual(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 1, 0, 0),
    );
  });
});

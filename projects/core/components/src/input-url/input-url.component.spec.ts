import { Component, Input } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { createTestComponentFactory, Spectator } from '@netbasal/spectator';
import { TranslateModule } from '@ngx-translate/core';
import { InputUrlComponent } from './input-url.component';

@Component({
  template: `<core-input-url [(ngModel)]="url"></core-input-url>`,
})
class TestInputUrlComponent {
  @Input() url: string;
}
describe('InputUrlComponent', () => {
  let spectator: Spectator<TestInputUrlComponent>;

  const createComponent = createTestComponentFactory({
    component: TestInputUrlComponent,
    declarations: [InputUrlComponent],
    imports: [FormsModule, TranslateModule.forRoot()],
  });

  it('should set correct value', async(() => {
    spectator = createComponent({ url: 'http://example.com' });

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      expect(spectator.query('input')).toHaveValue('http://example.com');
    });
  }));

  it('should open url in new window without change url', async(() => {
    spectator = createComponent({ url: 'http://example.com' });
    spyOn(window, 'open');

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      spectator.query('button').dispatchEvent(new MouseEvent('click'));
      expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
    });
  }));

  it('should open url in new window with add prefix', async(() => {
    spectator = createComponent({ url: 'example.com' });
    spyOn(window, 'open');

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      spectator.query('button').dispatchEvent(new MouseEvent('click'));
      expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
    });
  }));

  it('should not open url', async(() => {
    spectator = createComponent({ url: 'incorrect-url' });
    spyOn(window, 'open');

    spectator.fixture.whenStable().then(() => {
      spectator.detectChanges();
      spectator.query('button').dispatchEvent(new MouseEvent('click'));
      expect(window.open).not.toHaveBeenCalled();
    });
  }));
});

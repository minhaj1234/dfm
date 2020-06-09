import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMultipleLinesControlComponent } from './view-multiple-lines-control.component';

describe('ViewMultipleLinesControlComponent', () => {
  let component: ViewMultipleLinesControlComponent;
  let fixture: ComponentFixture<ViewMultipleLinesControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMultipleLinesControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMultipleLinesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('text', () => {
    it('should wrap content of the list in the <p> tag', () => {
      component.text = '<ol><li>item 1</li><li>item 2</li></ol>';

      expect(component.text).toEqual('<ol><li><p>item 1</p></li><li><p>item 2</p></li></ol>');
    });
  });
});

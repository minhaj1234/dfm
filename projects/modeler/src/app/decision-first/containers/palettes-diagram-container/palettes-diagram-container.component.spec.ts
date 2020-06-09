import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { DmsThemeModule } from '../../../theme';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { PalettesDiagramContainerComponent } from './palettes-diagram-container.component';

describe('PalettesDiagramContainerComponent', () => {
  let component: PalettesDiagramContainerComponent;
  let fixture: ComponentFixture<PalettesDiagramContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PalettesDiagramContainerComponent,
        MockComponent({ selector: 'dfm-go-js-links-palette', inputs: ['diagram'] }),
        MockComponent({ selector: 'dfm-go-js-add-object-palette', inputs: [''] }),
        MockComponent({ selector: 'dfm-go-js-existing-objects-palette', inputs: ['existingObjects'] }),
      ],
      imports: [
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalettesDiagramContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

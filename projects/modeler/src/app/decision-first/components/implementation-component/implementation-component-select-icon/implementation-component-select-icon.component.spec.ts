import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { ImplementationComponentSelectIconComponent } from './implementation-component-select-icon.component';

describe('ImplementationComponentSelectIconComponent', () => {
  let component: ImplementationComponentSelectIconComponent;
  let fixture: ComponentFixture<ImplementationComponentSelectIconComponent>;

  const icons = [{
    id: 'icon1',
    name: 'name1',
    tooltip: 'tooltip1',
    base64: '',
  } as ImplementationComponentIcon,
  {
    id: 'icon2',
    name: 'name2',
    tooltip: 'tooltip2',
    base64: '',
  } as ImplementationComponentIcon];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImplementationComponentSelectIconComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        DmsThemeModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationComponentSelectIconComponent);
    component = fixture.componentInstance;
    component.icons = icons;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('writeValue', () => {
    it('should change selectedIconId', () => {
      expect(component.selectedIconId).not.toEqual('icon1');

      component.writeValue('icon1');

      expect(component.selectedIconId).toEqual('icon1');
    });
  });

  describe('onSelectIconClick', () => {
    it('should emit selectIconClick', () => {
      const selectIconClick = spyOn(component.selectIconClick, 'emit');

      triggerMouseClick(fixture, '.icons-dropdown-list');

      expect(selectIconClick).toHaveBeenCalled();
    });
  });

  describe('select icon', () => {
    it('should set selectedIconId', () => {
      triggerMouseClick(fixture, '.icons-dropdown-list');
      fixture.detectChanges();

      expect(component.selectedIconId).toBeFalsy();

      triggerMouseClick(fixture, '.dropdown-item');

      expect(component.selectedIconId).toBeTruthy();
    });
  });
  
  describe('getSelectedIconTooltip', () => {
    it('should return icon tooltip', () => {
      component.selectedIconId = 'icon1';

      const result = component.getSelectedIconTooltip();

      expect(result).toEqual('tooltip1');
    });

    it('should return empty string if icon is indefined', () => {
      const result = component.getSelectedIconTooltip();

      expect(result).toEqual('');
    });
  });
});

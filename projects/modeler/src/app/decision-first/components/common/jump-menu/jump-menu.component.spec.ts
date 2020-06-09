import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ITab, JumpMenuItems, ObjectTabType } from 'core/models';
import { DmsThemeModule } from '../../../../theme';
import { DfmObjects, ObjectClassNames } from '../../../models/objects.model';
import * as fromStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { JumpMenuComponent } from './jump-menu.component';

describe('JumpMenuComponent', () => {
  let component: JumpMenuComponent;
  let fixture: ComponentFixture<JumpMenuComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumpMenuComponent ],
      imports: [
        DmsThemeModule,
        TestStoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getI18nResourceTypeObject', () => {
    it('should return resource string', () => {
      component.object = { id: 'id', className: ObjectClassNames.Decision} as DfmObjects;
      const expected = 'resources.decision';

      expect(component.getI18nResourceByString(component.object.className)).toEqual(expected);
    });
  });

  describe('getI18nResourceTypeObject', () => {
    it('should return true if anchor exists', () => {
      component.anchors[JumpMenuItems.BasicDetails] = {} as any;

      expect(component.isAnchorExists(JumpMenuItems.BasicDetails)).toBeTruthy();
    });
  });

  describe('isActive', () => {
    it('should return true if menu item active', () => {
      component.selectedMenuItem = JumpMenuItems.BasicDetails;

      expect(component.isActive(JumpMenuItems.BasicDetails)).toBeTruthy();
    });
  });

  describe('moveToAnchor', () => {
    it('should dispatch UpdateJumpMenuSelectedItemInTab', () => {
      spyOn(TestBed.get(Store), 'dispatch');
      component.object = { id: 'id'} as DfmObjects;
      component.selectedMenuItem = JumpMenuItems.BasicDetails;

      component.moveToAnchor(JumpMenuItems.BasicDetails);

      expect(TestBed.get(Store).dispatch).toHaveBeenCalledWith(
        new fromStore.UpdateJumpMenuSelectedItemInTab({id: 'id', jumpMenuSelectedItem: JumpMenuItems.BasicDetails})
      );
    });
  });

  describe('getTabEntityById', () => {
    it('should call scrollToAnchor if tab exists', () => {
      component.anchors[JumpMenuItems.Comments] = {nativeElement: { scrollIntoView: function(){} }} as any;
      spyOn(component.anchors[JumpMenuItems.Comments].nativeElement, 'scrollIntoView');
      const payload: ITab = {
        id: 'decisionId',
        type: ObjectTabType.Decision,
        jumpMenuSelectedItem: JumpMenuItems.Comments
      };
      component.object = {id: 'decisionId'} as DfmObjects;
      TestBed.get(Store).dispatch(new fromStore.AddTab(payload));

      expect(component.anchors[JumpMenuItems.Comments].nativeElement.scrollIntoView).toHaveBeenCalled();
    });
  });

  describe('getAnchorsTypes', () => {
    it('should return anchors array', () => {
      component.anchors[JumpMenuItems.BasicDetails] = {} as any;
      component.anchors[JumpMenuItems.Comments] = {} as any;

      const expected = [JumpMenuItems.BasicDetails, JumpMenuItems.Comments]

      expect(component.getAnchorsTypes()).toEqual(expected);
    });
  });
});

import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { getDebugElement } from 'core/testing';
import { UploadFileComponent } from './upload-file.component';

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;
  let spyRegisterOnChange: jasmine.Spy;
  let spyRegisterOnTouched: jasmine.Spy;

  const file = {
    name: 'File name'
  } as File;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadFileComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService
      ],
    })
    .overrideComponent(UploadFileComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents()
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    spyRegisterOnChange = jasmine.createSpy('registerOnChange', () => { });
    spyRegisterOnTouched = jasmine.createSpy('registerOnTouched', () => { });
    component.registerOnChange(spyRegisterOnChange);
    component.registerOnTouched(spyRegisterOnTouched);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('writeValue', () => {
    it('should display file name', () => {
      component.writeValue(file);
      fixture.detectChanges();

      const fileName = getDebugElement(fixture, '.file-name').nativeElement.innerText;
      expect(fileName).toEqual(file.name);
    });
  });

  describe('onFileSelected', () => {
    it('should set fileToUpload', () => {
      component.onFileSelected([file] as any);
      fixture.detectChanges();

      const fileName = getDebugElement(fixture, '.file-name').nativeElement.innerText;
      expect(fileName).toEqual(file.name);
    });

    it('should not call onChange', () => {
      component.onFileSelected([] as any);

      expect(spyRegisterOnChange).not.toHaveBeenCalled();
    });

    it('should call onChange', () => {
      component.onFileSelected([file] as any);

      expect(spyRegisterOnChange).toHaveBeenCalled();
    });
  });
});

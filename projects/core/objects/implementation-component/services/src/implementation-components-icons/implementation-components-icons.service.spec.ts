import { TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { FakeExternalService } from 'core/testing';
import { ImplementationComponentsIconsService } from './implementation-components-icons.service';

describe('HttpErrorMessageService', () => {
  let service: ImplementationComponentsIconsService;
  let externalService: FakeExternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularHalModule],
      providers: [
        ImplementationComponentsIconsService,
        { provide: ExternalService, useValue: new FakeExternalService() },
      ],
    });
    service = TestBed.get(ImplementationComponentsIconsService);
    externalService = TestBed.get(ExternalService);
  });

  it('should be created', () => {   
    expect(service).toBeTruthy();
  });
});

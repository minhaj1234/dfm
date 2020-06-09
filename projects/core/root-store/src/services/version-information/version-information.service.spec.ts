import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { VersionInformation } from 'core/models';
import { FakeExternalService } from 'core/testing';
import { VersionInformationService } from './version-information.service';

describe('VersionInformationService', () => {
  let service: VersionInformationService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [VersionInformationService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(VersionInformationService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single minimal decisions from the server into a Decision; this makes sure links are sanitized', async(() => {
    service.loadVersionInformation().subscribe((versionInformation) => {
      expect(versionInformation).toEqual(jasmine.any(VersionInformation));
    });
  }));
});

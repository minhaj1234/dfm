import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { PrintObjectComponent } from '../../..';
import { DmsThemeModule } from '../../../../../theme';
import { BusinessObjective } from '../../../../models/businessObjective.model';
import { Decision } from '../../../../models/decision.model';
import { Organization } from '../../../../models/organization.model';

describe('PrintObjectComponent', () => {
  let component: PrintObjectComponent;
  let fixture: ComponentFixture<PrintObjectComponent>;
  const object = new Decision();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrintObjectComponent,
        MockComponent({ selector: 'dfm-print-property', inputs: ['text', 'title', 'objects', 'includeDescription'] }),
        MockComponent({ selector: 'dfm-comment-item-display', inputs: ['comment', 'displayForPrinting'] }),
        MockComponent({ selector: 'dfm-decision-answer', inputs: ['decision', 'isReadOnly'] }),
      ],
      imports: [
        DmsThemeModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintObjectComponent);
    component = fixture.componentInstance;
    component.object = object;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doDisplayOrganizationContext', () => {
    it('should return true if organizationsImpactedByDecisions is not empty', () => {
      const decision = {
        organizationsImpactedByDecisions: [{}],
        organizationsMakesDecisions: [],
        organizationsOwnsDecisions: []
      } as Decision;

      const result = component.doDisplayOrganizationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return true if organizationsMakesDecisions is not empty', () => {
      const decision = {
        organizationsImpactedByDecisions: [],
        organizationsMakesDecisions: [{}],
        organizationsOwnsDecisions: []
      } as Decision;

      const result = component.doDisplayOrganizationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return true if organizationsOwnsDecisions is not empty', () => {
      const decision = {
        organizationsImpactedByDecisions: [],
        organizationsMakesDecisions: [],
        organizationsOwnsDecisions: [{}]
      } as Decision;

      const result = component.doDisplayOrganizationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const decision = {
        organizationsImpactedByDecisions: [],
        organizationsMakesDecisions: [],
        organizationsOwnsDecisions: []
      } as Decision;

      const result = component.doDisplayOrganizationContext(decision);

      expect(result).toBeFalsy();
    });
  });

  describe('doDisplayApplicationContext', () => {
    it('should return true if businessObjectives is not empty', () => {
      const decision = {
        businessObjectives: [{}],
        events: [],
        systems: [],
        processes: [],
      } as Decision;

      const result = component.doDisplayApplicationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return true if events is not empty', () => {
      const decision = {
        businessObjectives: [],
        events: [{}],
        systems: [],
        processes: [],
      } as Decision;

      const result = component.doDisplayApplicationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return true if systems is not empty', () => {
      const decision = {
        businessObjectives: [],
        events: [],
        systems: [{}],
        processes: [],
      } as Decision;

      const result = component.doDisplayApplicationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return true if processes is not empty', () => {
      const decision = {
        businessObjectives: [],
        events: [],
        systems: [],
        processes: [{}],
      } as Decision;

      const result = component.doDisplayApplicationContext(decision);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const decision = {
        businessObjectives: [],
        events: [],
        systems: [],
        processes: [],
      } as Decision;

      const result = component.doDisplayApplicationContext(decision);

      expect(result).toBeFalsy();
    });
  });

  describe('doDisplayBusinessImpact', () => {
    it('should return true if decisions is not empty', () => {
      const businessObjective = {
        decisions: [{}],
        organizations: [],
      } as BusinessObjective;

      const result = component.doDisplayBusinessImpact(businessObjective);

      expect(result).toBeTruthy();
    });

    it('should return true if organizations is not empty', () => {
      const businessObjective = {
        decisions: [],
        organizations: [{}],
      } as BusinessObjective;

      const result = component.doDisplayBusinessImpact(businessObjective);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const businessObjective = {
        decisions: [],
        organizations: [],
      } as BusinessObjective;

      const result = component.doDisplayBusinessImpact(businessObjective);

      expect(result).toBeFalsy();
    });
  });

  describe('doDisplayDecisionsInvolved', () => {
    it('should return true if ownsDecisions is not empty', () => {
      const organization = {
        ownsDecisions: [{}],
        makesDecisions: [],
        impactedByDecisions: [],
      } as Organization;

      const result = component.doDisplayDecisionsInvolved(organization);

      expect(result).toBeTruthy();
    });
    
    it('should return true if makesDecisions is not empty', () => {
      const organization = {
        ownsDecisions: [],
        makesDecisions: [{}],
        impactedByDecisions: [],
      } as Organization;

      const result = component.doDisplayDecisionsInvolved(organization);

      expect(result).toBeTruthy();
    });

    it('should return true if impactedByDecisions is not empty', () => {
      const organization = {
        ownsDecisions: [],
        makesDecisions: [],
        impactedByDecisions: [{}],
      } as Organization;

      const result = component.doDisplayDecisionsInvolved(organization);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const organization = {
        ownsDecisions: [],
        makesDecisions: [],
        impactedByDecisions: [],
      } as Organization;

      const result = component.doDisplayDecisionsInvolved(organization);

      expect(result).toBeFalsy();
    });
  });

  describe('doDisplayOwnsOrganization', () => {
    it('should return true if knowledgeSources is not empty', () => {
      const organization = {
        knowledgeSources: [{}],
        inputDatas: [],
      } as Organization;
      
      const result = component.doDisplayOwnsOrganization(organization);

      expect(result).toBeTruthy();
    });

    it('should return true if inputDatas is not empty', () => {
      const organization = {
        knowledgeSources: [],
        inputDatas: [{}],
      } as Organization;
      
      const result = component.doDisplayOwnsOrganization(organization);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const organization = {
        knowledgeSources: [],
        inputDatas: [],
      } as Organization;

      const result = component.doDisplayOwnsOrganization(organization);

      expect(result).toBeFalsy();
    });
  });

  describe('doDisplayObjectivesInvolved', () => {
    it('should return true', () => {
      const organization = {
        businessObjectives: [{}],
      } as Organization;
      
      const result = component.doDisplayObjectivesInvolved(organization);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const organization = {
        businessObjectives: [],
      } as Organization;

      const result = component.doDisplayObjectivesInvolved(organization);

      expect(result).toBeFalsy();
    });
  });

  describe('doDisplayOrganizationStructure', () => {
    it('should return true if there is parentOrganization', () => {
      const organization = {
        parentOrganization : {},
        childOrganizations: []
      } as Organization;
      
      const result = component.doDisplayOrganizationStructure(organization);

      expect(result).toBeTruthy();
    });

    it('should return true if childOrganizations is not empty', () => {
      const organization = {
        childOrganizations: [{}]
      } as Organization;
      
      const result = component.doDisplayOrganizationStructure(organization);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const organization = {
      } as Organization;

      const result = component.doDisplayOrganizationStructure(organization);

      expect(result).toBeFalsy();
    });
  });
});

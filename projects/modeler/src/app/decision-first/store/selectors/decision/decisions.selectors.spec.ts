import { TestBed } from '@angular/core/testing';
import { select, Store } from '@ngrx/store';
import { Decision } from '../../../models/decision.model';
import { ObjectClassNames } from '../../../models/objects.model';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromReducers from '../../reducers';
import * as fromSelectors from './decisions.selectors';

describe('Decisions Selectors', () => {
  let store: Store<fromReducers.IDecisionFirstState>;

  const decisions: Decision[] = [
    {
      className: ObjectClassNames.Decision,
      id: 'decision1',
      name: 'Decision One',
      diagrams: [{ id: 'diagram1' }],
      requiresInputData: [{ id: 'input data 1' }, { id: 'input data 2' }],
      requiresKnowledgeSources: [{ id: 'zyx' }, { id: 'wvu' }, { id: 'tsr' }],
      requiresDecisions: [{ id: 'requires1' }, { id: 'requires2' }, { id: 'requires3' }],
      requiredByDecisions: [{ id: 'requiredBy1' }, { id: 'requiredBy2' }],
      organizationsOwnsDecisions: [{ id: 'organization 1' }, { id: 'organization 2' }],
      organizationsMakesDecisions: [{ id: 'organization 3' }, { id: 'organization 4' }],
      organizationsImpactedByDecisions: [{ id: 'organization 5' }, { id: 'organization 6' }],
      businessObjectives: [{ id: 'business objective 1' }, { id: 'business objective 2' }],
      processes: [{ id: 'process 1' }, { id: 'process 2' }],
      events: [{ id: 'event 1' }, { id: 'event 2' }],
      systems: [{ id: 'system 1' }, { id: 'system 2' }],
      implementationComponents: [{ id: 'implementation component 1' }, { id: 'implementation component 2' }]
    } as any,
    {
      className: ObjectClassNames.Decision,
      id: 'decision2',
      name: 'Decision Two',
      diagrams: [{ id: 'diagram1' }, { id: 'diagram2' }],
      requiresInputData: [{ id: 'input data 3' }, { id: 'input data 4' }],
      requiresKnowledgeSources: [{ id: 'zyx' }, { id: 'pon' }, { id: 'mlk' }],
      requiresDecisions: [{ id: 'requires4' }, { id: 'requires5' }, { id: 'requires6' }],
      requiredByDecisions: [{ id: 'requiredBy3' }, { id: 'requiredBy4' }],
      organizationsOwnsDecisions: [{ id: 'organization 7' }, { id: 'organization 8' }],
      organizationsMakesDecisions: [{ id: 'organization 9' }, { id: 'organization 10' }],
      organizationsImpactedByDecisions: [{ id: 'organization 11' }, { id: 'organization 12' }],
      businessObjectives: [{ id: 'business objective 3' }, { id: 'business objective 4' }],
      processes: [{ id: 'process 3' }, { id: 'process 4' }],
      events: [{ id: 'event 3' }, { id: 'event 4' }],
      systems: [{ id: 'system 3' }, { id: 'system 4' }],
      implementationComponents: [{ id: 'implementation component 3' }, { id: 'implementation component 4' }]
    } as any,
    {
      className: ObjectClassNames.Decision,
      id: 'decision3',
      name: 'Decision Three',
      diagrams: [{ id: 'diagram1' }, { id: 'diagram2' }, { id: 'diagram3' }],
      requiresInputData: [{ id: 'input data 5' }, { id: 'input data 6' }],
      requiresKnowledgeSources: [{ id: 'pon' }, { id: 'mlk' }, { id: 'jih' }],
      requiresDecisions: [{ id: 'requires7' }, { id: 'requires8' }, { id: 'requires9' }],
      requiredByDecisions: [{ id: 'requiredBy5' }, { id: 'requiredBy6' }],
      organizationsOwnsDecisions: [{ id: 'organization 13' }, { id: 'organization 14' }],
      organizationsMakesDecisions: [{ id: 'organization 15' }, { id: 'organization 16' }],
      organizationsImpactedByDecisions: [{ id: 'organization 17' }, { id: 'organization 18' }],
      businessObjectives: [{ id: 'business objective 5' }, { id: 'business objective 6' }],
      processes: [{ id: 'process 5' }, { id: 'process 6' }],
      events: [{ id: 'event 5' }, { id: 'event 6' }],
      systems: [{ id: 'system 5' }, { id: 'system 6' }],
      implementationComponents: [{ id: 'implementation component 5' }, { id: 'implementation component 6' }]
    } as any,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getLoadedDecisionsAsArray', () => {
    it('should return the loaded diagrams in array form', () => {
      let result;

      store.pipe(select(fromSelectors.getLoadedDecisionsAsArray)).subscribe((value) => {
        result = value;
      });

      expect(result).toEqual([]);

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));

      expect(result).toEqual([decisions[0], decisions[1], decisions[2]]);
    });
  });

  describe('getDecisionNetworkActive', () => {
    it('should return if the network is active', () => {
      let result;

      store.pipe(select(fromSelectors.getDecisionNetworkActive)).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getSelectedDecision', () => {
    it('should return the selected decision', () => {
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));

      let result;

      store.pipe(select(fromSelectors.getSelectedDecision('decision1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(decisions[0]);
    });
  });

  describe('getSelectedDecisionNetworkActive', () => {
    it('should return the selected decision network active', () => {
      store.dispatch(new fromActions.UpdateDecision({
        decision: decisions[0]
      }));

      let result;

      store.pipe(select(fromSelectors.getSelectedDecisionNetworkActive('decision1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(true);
    });

    it('should return false if the decision is not loaded', () => {
      let result;

      store.pipe(select(fromSelectors.getSelectedDecisionNetworkActive('decision1'))).subscribe((value) => {
        result = value;
      });

      expect(result).toBe(false);
    });
  });

  describe('getLoadedDecisionsDiagrams', () => {
    it('should return the loaded decisions diagrams', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsDiagrams)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].diagrams,
        ...decisions[2].diagrams,
        ...decisions[1].diagrams,
      ]);
    });
  });

  describe('getLoadedDecisionDecisions', () => {
    it('should return the loaded decisions decisions', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsDecisions)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].requiresDecisions,
        ...decisions[0].requiredByDecisions,
        ...decisions[2].requiresDecisions,
        ...decisions[2].requiredByDecisions,
        ...decisions[1].requiresDecisions,
        ...decisions[1].requiredByDecisions,
      ]);
    });
  });

  describe('getLoadedDecisionsInputData', () => {
    it('should return input data', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsInputData)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].requiresInputData,
        ...decisions[2].requiresInputData,
        ...decisions[1].requiresInputData,
      ]);
    });
  });

  describe('getLoadedDecisionKnowledgeSources', () => {
    it('should return the loaded decisions knowledge sources', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsKnowledgeSources)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].requiresKnowledgeSources,
        ...decisions[0].requiredByKnowledgeSources,
        ...decisions[2].requiresKnowledgeSources,
        ...decisions[2].requiredByKnowledgeSources,
        ...decisions[1].requiresKnowledgeSources,
        ...decisions[1].requiredByKnowledgeSources,
      ]);
    });
  });

  describe('getLoadedDecisionsOrganizations', () => {
    it('should return organizations', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsOrganizations)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].organizationsOwnsDecisions,
        ...decisions[0].organizationsMakesDecisions,
        ...decisions[0].organizationsImpactedByDecisions,
        ...decisions[2].organizationsOwnsDecisions,
        ...decisions[2].organizationsMakesDecisions,
        ...decisions[2].organizationsImpactedByDecisions,
        ...decisions[1].organizationsOwnsDecisions,
        ...decisions[1].organizationsMakesDecisions,
        ...decisions[1].organizationsImpactedByDecisions,
      ]);
    });
  });

  describe('getLoadedDecisionsBusinessObjectives', () => {
    it('should return business objectives', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsBusinessObjectives)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].businessObjectives,
        ...decisions[2].businessObjectives,
        ...decisions[1].businessObjectives,
      ]);
    });
  });

  describe('getLoadedDecisionsProcesses', () => {
    it('should return processes', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsProcesses)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].processes,
        ...decisions[2].processes,
        ...decisions[1].processes,
      ]);
    });
  });

  describe('getLoadedDecisionsEvents', () => {
    it('should return events', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsEvents)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].events,
        ...decisions[2].events,
        ...decisions[1].events,
      ]);
    });
  });

  describe('getLoadedDecisionsSystems', () => {
    it('should return systems', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsSystems)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].systems,
        ...decisions[2].systems,
        ...decisions[1].systems,
      ]);
    });
  });

  describe('getLoadedDecisionsImplementationComponents', () => {
    it('should return implementation components', () => {
      let result;

      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[0]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[2]));
      store.dispatch(new fromActions.LoadDecisionSuccess(decisions[1]));

      store.pipe(select(fromSelectors.getLoadedDecisionsImplementationComponents)).subscribe((value) => (result = value));

      expect(result).toEqual([
        ...decisions[0].implementationComponents,
        ...decisions[2].implementationComponents,
        ...decisions[1].implementationComponents,
      ]);
    });
  });
});

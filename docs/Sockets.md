# Sockets

There are five socket events that can be fired by the server right now

from auth-stomp.service.ts

> export type eventType = 'create' | 'delete' | 'update' | 'linkUpdate' | 'linkDelete';

## Creation

At the moment, we don't really care if something gets created (although the business may later decide to refresh the search - that might be weird for the user though if something just randomly gets added or removed from their list because it no longer matches their search pattern)

## Deletion

On a delete, we just check to see if it is in a list or opened in a tab and remove it from those places

Delete ToDo:

- Remove it if is a child of an open object (diagram, org, decision or ks). This should be a lot like what we do on update except you will filter it out.

## Update, LinkUpdate and LinkDelete

Right now these are all doing the same thing because the server does not tell us WHAT was linked or unlinked. In this case, we just have to refresh the entire object. Eventually, if the server gets smart enough to tell us exactly what happened to the object, we should be able to split this into three functions and only refresh what is actually affected. For example, if a decision is added to a diagram, we shouldn't have to refresh the entire diagram, we should just be able to load that single decision and merge it into the diagram - this saves some network requests.

## Stomp Services

All stomp services inject the AuthStompService which allows us to pass in the access token to the socket request. Once authenticated, it indicates it is ready and the services will automatically connect to the socket endpoint and process the incomming messages. We chose to a service for each request so we didn't have a bunch of if-statements and pyramid hell.

All stomp services run in the background and update things as needed, for this reason, they MUST be injected into the DecisionFirstComponent even though they are never "used" by the component itself. This makes sure that the services are active as long as the DecisionFirstModule is loaded but can destroy themselves once it is removed.

## Warning - Loading things multiple times on updates.

Right now, if anything but a decision exists in a list, in a diagram and is open for editing and a socket message comes through notifying that it has been updated, it will be loaded three times. This pattern grew out of the slowly building the app but is probably not the most effecient. You should fix this and I think it would look something like this. I have fixed it in the decisions and reposted the code here with some comments

```TypeScript
// decision-stomp.service.ts
defaultHandler(socketMessage: ISocketMessage) {
  // This projection loads the most
  if (!!this.openTabs[socketMessage.resourceId]) {
    this.store.dispatch(new fromActions.LoadDecision(socketMessage.resourceId));
  }

  // This projection loads the second most
  else if (this.childDecisions.some((decision) => decision.id === socketMessage.resourceId)) {
    this.store.dispatch(new fromActions.LoadDecisionAsChild(socketMessage.resourceId));
  }

  // This projection loads the least
  else if (this.decisionsInLists.some((decision) => decision.id === socketMessage.resourceId)) {
    this.store.dispatch(new fromActions.LoadSingleDecisionForDecisionsList(socketMessage.resourceId));
  }
}

// decisions.effects.ts
// Everything that is returned from a minimal projection
const minimalKeys = ['type', 'name', 'id', '_links'];
// Everything that is returned from a relations projection
const relationsKeys = [...minimalKeys, 'knowledgeSources', 'sourceDecisions'];

// Using ramda to only get those items
const pairDownToMinimal = pick(minimalKeys);
const pairDownToRelations = pick(relationsKeys);
// ....
  @Effect()
  loadDecision$ = this.actions$.pipe(
    ofType(fromActions.LOAD_DECISION),
    switchMap((action: fromActions.LoadDecision) => {
      return this.decisionsService.getSingle(action.payload).pipe(
        switchMap((decision) => {
          const relationsDecision = pairDownToRelationship(decision);
          const minimalDecision = pairDownToMinimal(decision);
          return [
            new fromActions.LoadDecisionSuccess(decision)
            // These are new and a copy of what happens in loadDecisionAsChild$
            new fromActions.UpdateDecisionInDiagrams(relationsDecision),
            new fromActions.UpdateDecisionInDecisions(relationsDecision),
            new fromActions.LoadSingleDecisionForDecisionsListSuccess(minimalDecision)
          ]),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload }))),
      );
    }),
  );

  @Effect()
  loadDecisionAsChild$ = this.actions$.pipe(
    ofType(fromActions.LOAD_DECISION_AS_CHILD),
    switchMap((action: fromActions.LoadDecisionAsChild) => {
      return this.decisionsService.getSingleWithRelations(action.payload).pipe(
        switchMap((decision) => {
          const minimalDecision = pairDownToMinimal(decision);
          return [
            new fromActions.UpdateDecisionInDiagrams(decision),
            new fromActions.UpdateDecisionInDecisions(decision),
            // This is new and a copy of what happens in the decisions list effects when a single decision is loaded
            new fromActions.LoadSingleDecisionForDecisionsListSuccess(minimalDecision)
          ]
        ),
        catchError((error) => of(new fromActions.DecisionFailure({ error, id: action.payload }))),
      );
    }),
  );
```

> I ran out of time to implement something like this with good testing on everything but decisions is a great model to follow to fix this across the others.

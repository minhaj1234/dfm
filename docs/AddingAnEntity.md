# Adding a new entity type.

_Using Decisions as an example_

1.  [Create a Model](#Create-a-model)
1.  [Create Actions](#Create-Actions)
1.  [Create Reducers](#Create-Reducers)
1.  [Create Selectors](#Create-Selectors)
1.  [Create Service](#Create-Service)
1.  [Create Effects](#Create-Effects)
1.  [Create Stomp Service (for sockets)](#Create-a-Stomp-Service)

## Create a Model

In the **{decisions first folder}/models/** folder create a file _decision.model.ts_ and populate the shape of the model.

> Make sure to include a className since NgRx will strip the class information.

> The more information you fill in here, the better IntelliSense will work for you as you use the model so make sure you are complete.

Add the string 'decision' to the type key in _tab.model.ts_

## Create Actions

In the **{decisions first folder}/store/actions/** folder create four new files _decisions.actions.ts_, _decisions.actions.spec.ts_, _decisionsList.action.ts_, and _decisionsList.spec.action.ts_.

> We keep the actions loaded for editing and the list of actions separate so that we can take advantage of the ngrx/entity package to make the work of writing crud reducers easy.

> I highly recommend 100% test coverage for everything in the store as it the logic that controls all of the state inside of your app

Add your actions and tests

> I usually just copy and paste an existing action/spec file and replace all then fix with small changes changes. Decisions is probably where I had learned the most and so is probably the most DRY example to copy.

Then add lines to the file _index.ts_ inside of the actions folder to export the both set of actions.

**Run your tests to make sure that your actions are 100% covered!**

## Create Reducers

In the **{decisions first folder}/store/reducers/** folder create four new files _decisions.reducer.ts_, _decisions.reducer.spec.ts_, _decisionsList.reducer.ts_, and _decisionsList.spec.reducer.ts_.

> This is where we get to take advantage of the @ngrx/entity package to do most of the CRUD for us

Fill out your actions and the test files (again, copy and paste is your friend)

In the reducers _index.ts_ file, add lines for both sets of reducers that you created.

**Run your tests to make sure that your reducers are 100% covered!**

## Create Selectors

In the **{decisions first folder}/store/selectors/** folder create four new files _decisions.selectors.ts_, _decisions.selectors.spec.ts_, _decisionsList.selectors.ts_, and _decisionsList.spec.selectors.ts_.

Fill these files in with any selectors you need, taking advantage of copying and pasting.

Add lines to export these from the _index.ts_ file.

**Run your tests to make sure that your selectors are 100% covered!**

## Create Service

In the **{decisions first folder}/services/** folder create two new files _decisions.service.ts_ and _decisions.service.spec.ts_

There are three projections that we are using in here because there are three places that decisions can be stored

- In a list (minimal projection)
- Being graphed (relations projection)
- While editing (edit projection)

The list is the only time where we would load more than one decision as a time so we create two routes, one getSingleMinimal (in case a socket update shows up and we need to update the name or something) and one to get a list of them based on a search: getSomeMinimalWithSearch.

getSingleWithRelations is for when a socket event fires and that decision belongs to a graphed diagram, we load the new decision into the diagram so that the graph can re-render.

Last we have the getSingle for when we are editing the object and need everything about it.

Since decisions can own other decisions, we also need to create routes to add and remove decision relationships.

Since decisions can own knowledgeSources they also get routes to add and remove knowledge sources.

Finally, notice the toDecision function which converts a object decision to a Decision class. We do this because we need call sanitizeLinks on all of the links so that they are no longer [templated](https://docs.spring.io/spring-hateoas/docs/current/reference/html/#spis.curie-provider). Since decisions come back with sourceDecisiona dn knowledgeSources, we need to remote the templates from those links as well so we are complete safe. Every entity needs its own toEntity function that is exported so that other entities can make sure it is sanitized.

**Run your tests to make sure that your service is 100% covered!**

Add this service to the index.ts file so that it will be picked up by the module.

## Create Effects

In the **{decisions first folder}/store/effects/** folder create four new files _decisions.effects.ts_, _decisions.effects.spec.ts_, _decisionslist.effects.ts_, and _decisionslist.effects.spec.ts_

Effects are how we create side effects in the app (mostly API calls). The Effects list listens for Actions to be called and when the action ofType() is matched, it starts its own process.

most of these effects should be fairly self explanitory, when events like add or remove or link, etc are fired, we need to let the API know so that is reflected to all of the users. Tests on these can be a little bit weird but we followed conventions and [this](https://medium.com/@adrianfaciu/testing-ngrx-effects-3682cb5d760e) is a pretty good read on what is going on.

**Run your tests to make sure that your effects are 100% covered!**

## Create a Stomp Service

#### (for Sockets)

In the **{decisions first folder}/stompServices/** folder create two new files _decisions-stomp.service.ts_ and _decisions-stomp.service.spec.ts_

In the constructor, we subscribe to the tenant and only fire once we have a tenant so we can subscribe to the correct socket endpoint. Once we are subscribed, we send the socket messages to the correct hander.

We also need some information so that we can pass these updates on to the correct place. First we subscribeToChildDecisions() with everything that can be loaded in tabs. Currently that is Diagrams (graphed), Decisions (decisions can own decisions) and Organizations (organizations can own decisions). If any of these own that decision, we need to load that decision again so we can inject the new data.

Then we subscribeToTabs(), since decisions can be open in tabs, if any new update comes in, we need to make sure that the user's tab shows the latest the information.

Finally we subscribeToDecisionsInList() so if this decision is in a list and it updates, we can update it the list with the latest information.

### Handling Events

Currently we do not care about create events because we don't want the user to automatically get new stuff that may not match their search terms. Eventually the business may want to change this so the search is called again but right now create is a noop.

On delete, we make sure that the tab closes if it is open and the decision no longer shows up in the search results if it was there. Both of these actions are reduced by the @ngrx/ removeOne() function so they have no effect if they are not in the list and are safe to call without any if statements.

On update we need to see what all needs to be updated. If this decision is in a list (currently either DecisionsList or DiagrammingElements) it will be loaded minimally for those updates. If it is currently open for editng by the user, we reload everything so that the user has the freshest information and finally if it is a child of something open, we load it, with relations, so that it can be injected into that something.

Update the handlers to do what is needed (using this as a guideline) and then add this stomp-service to the _index.ts_ file.

**Run your tests to make sure that your effects are 100% covered!**

Since this service needs to subscribe immediately, we need to inject it into the **{decisions first folder}/containers/decision-first** container. This will allow the services to be shut down if the user ever gets away from the {decision first folder module} so they don't stay in memory/subscribed when they are no longer needed. As of this right, the decisions-first module is the only module but trying to future-proof.

Once everything is wired up, the selectors and actions can be used in any component to display data to the user and respond to user events.

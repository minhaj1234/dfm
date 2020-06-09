# Pagination

1.  [Add the action](#Add-the-action)
1.  [Add the reducer](#Add-the-reducer)
1.  [Add the selectors](#Add-the-selectors)
1.  [Add a route to the service](#Add-a-route-to-the-service)
1.  [Add the effect](#Add-the-effect)

As of this writing, only diagrammingElements are paginating so we will use that as an example.

## Add the action

For everything that should be paginated, we add a new action to that list called LoadMoreResultsFor{Entity} which takes a string that will be the url with the more elements.

**Make sure this action is tested and coverage for this file remains at 100%**

## Add the reducer

In the State Interface, we add a pagination key so that the list can keep track of how many are loaded and how many are left, etc.

We need to add the following handlers

- loadMore{Entity}Handler which makes the network active (and later calls the effect that loads more)

- loadMore{Entity}SuccessHandler which adds the results to the current list

> Note the use of addMany which adds to the current list vs addAll which replaces the list.

**Make sure these reducers are tested and coverage remains at 100%**

## Add the selectors

Create a selector to get the _pagination_ from the state so that your components can use it

**Make sure these reducers are tested and coverage remains at 100%**

## Add a route to the service

This router will take a url (from our action above) and get the results to that url. We also need to make sure that the pagination is being updated and tied together with the nextUrl.

> This nextUrl only shows up if there are more results so we can use is existance of the nextUrl to activate or deactivate the button for the user to load more results.

**Make sure this new route is tested and coverage remains at 100%**

## Add the effect

we create a new effect LoadMoreResultsFor{Entity} and listen for the LOAD*MORE_RESULTS_FOR*{ENTITY} action. Once this action is called, this entity will use the url passed to the action to load more results then dispatch the LoadMore{Entity}ListSuccess action with the results which will add them to the current list because of our work above with the reducers.

Once this has been completed, pagination can be used on the Entity in any of the components. See _pagination-load-more_ for the logic in using the pagination information and _go_js_decision_palette_ for an example of using _pagination-load-more_

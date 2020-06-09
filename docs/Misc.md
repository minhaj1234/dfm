# Avoid subscribing

## Rational

Subscriptions which are not unsubscribed from will cause memory leaks and could degrade the performance of the app.

## Use the **async** pipe

Try to avoid subscribing as much as possible to observables. If something is going to be used to display data on the page, prefer the **| async** pipe (see _edit-organization-container.component.html_ for an example) as this will automatically unsubscribe from the observable when the component is destroyed.

## If you must subscribe but only need the data once

Try to **pipe** a **first()** call in before the subscription so that the subscription is automatically cancelled after you get the data you need. See _tabs.component.ts:checkIfTabNeedsToBeLoadedFirstTime()_ for an example.

## If you need to subscribe as long as the component is alive

Create a **subscriptions: Subscription[]** variable in the class and push all of your subscriptions to this. In the **ngOnDestroy()** function make sure all of the subscriptions are being unsubscribed so that there are no memory leaks. See _tabs.component.ts:ngOnInit()_ for an example

# Helpful plugins

I used [Visual Studio Code](https://code.visualstudio.com/) to write all of this because it has great support for intelliSense with TypeScript. Plugins that I found helpful while writing this project

- Angular 6 Snippets
- Angular Language Service
- CodeMetrics (try not to get over a 10 in complexity - if you went over, it's time to refactor)
- indent-rainbow
- Prettier - Code formatter (your code is going to be prettified before commit anyway, might as well benefit.)
- Rainbow Brackets
- TSLint (your code must pass linting so having that show up in your editor so you can fix as you go is really nice)

# Redux Dev Tools

Chrome has a great tool set for working with Redux and NgRx can take advantage of it. Highly recommend that you install https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en to help you develop and follow changes in state

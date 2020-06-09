# Config

We wanted to be sure that we could build once and deploy anywhere so all of the variables that could change based on environment are calculated on the fly by the Config class.

This class looks at the URL and makes a decision which variables to serve up. We currently have configs for localhost and dev **but you will need to add some for staging/UAT/testing and production.**

This is also a great place to store constants that will be used all over the app (like debounceTime before processing a user's typing)

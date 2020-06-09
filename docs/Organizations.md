# Organizations

## Are NOT finished

The organization is special because it can only contain a single knowledge source. Due to server limitations, this means that we have to post linking requests to the knowledgeSource and decision urls instead of the organization url. This in turn makes the socket events fire on the knowledge sources and decisions but not the organization, this broke the ability to refresh the organizations.

Most of the code is there but the socket stuff is not firing the way it should be.

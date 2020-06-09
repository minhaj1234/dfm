export const anything = { asymmetricMatch: () => true };
export function matchingArgument<T>(predicate: (_: T) => boolean){ return ({ asymmetricMatch: (it) => predicate(it) })};
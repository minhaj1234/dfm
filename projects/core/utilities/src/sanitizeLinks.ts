interface IHateoasLink {
  href: string;
}

interface IHateoasLinkWithTemplates extends IHateoasLink {
  templated?: boolean;
}

export function sanitizeLinks<T extends Record<string, IHateoasLinkWithTemplates>>(links: T): T {
  return Object.keys(links)
    .map((key) => ({ key, value: links[key] }))
    .reduce((object: any, { key, value }) => {
      if (value.templated) {
        object[key] = {
          href: value.href.replace(/{\?.*?}/g, ''),
        };
      } else {
        object[key] = value;
      }
      return object;
    }, {}) as T;
}

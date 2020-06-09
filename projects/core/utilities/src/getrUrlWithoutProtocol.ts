export function getUrlWithoutProtocol(url: string ): string {
  return url.replace(/(^\w+:|^)\/\//, '');
}

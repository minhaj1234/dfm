import { IPagination } from 'core/models';

export function getPagination(objs: any): IPagination {
  const pagination: IPagination = objs.page;
  pagination.prevUrl = objs._links.prev ? objs._links.prev.href : null;
  pagination.selfUrl = objs._links.self ? objs._links.self.href : null;
  pagination.nextUrl = objs._links.next ? objs._links.next.href : null;

  return pagination;
}
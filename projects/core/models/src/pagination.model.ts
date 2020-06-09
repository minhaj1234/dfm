export interface IPagination {
  prevUrl?: string;
  selfUrl?: string;
  nextUrl?: string;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IResultsWithPages<T> {
  results: T[];
  pagination: IPagination;
}

export const blankPages: IPagination = {
  number: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
};

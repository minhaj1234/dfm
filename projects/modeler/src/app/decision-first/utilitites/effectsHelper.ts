import { ITab } from 'core/models';

export function isInOpenTabs(previewDiagramId: string, allTabs: ITab[]): boolean {
  return allTabs.some((tab) => tab.id === previewDiagramId);
}

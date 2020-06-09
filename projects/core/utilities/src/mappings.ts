import { VersionInformation } from 'core/models';

export function toVersionInformation(sourceVersionInformation: any): VersionInformation {
  const targetVersionInformation = new VersionInformation();
  Object.keys(sourceVersionInformation).forEach((key) => {
    targetVersionInformation[key] = sourceVersionInformation[key];
  });

  return targetVersionInformation;
}

import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';

const toImplementationComponentIconFields = {
  'icon': 'base64',
};

export function toImplementationComponentIcon(sourceImplementationComponentIcon: any): ImplementationComponentIcon {
  const targetImplementationComponentIcon = new ImplementationComponentIcon();
  Object.keys(sourceImplementationComponentIcon).forEach((key) => {
    if(toImplementationComponentIconFields[key]) {
      targetImplementationComponentIcon[toImplementationComponentIconFields[key]] = sourceImplementationComponentIcon[key];
    } else {
      targetImplementationComponentIcon[key] = sourceImplementationComponentIcon[key];
    }
  });

  return targetImplementationComponentIcon;
}

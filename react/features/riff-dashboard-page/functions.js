import { customHistory } from "../riff-platform/components";

export function navigateWithoutReload(component, route) {
    if(route) customHistory.push(route);
    APP.store.getState()['features/base/app'].app._navigate({
        component,
        href: null
    });
}

export function maybeExtractIdFromDisplayName(displayNameMaybeWithFirebaseId) {
  if (typeof displayNameMaybeWithFirebaseId !== 'string') return {};

  let displayName = displayNameMaybeWithFirebaseId;
  let firebaseId = '';
  const separator = '|';

  if (displayNameMaybeWithFirebaseId.includes(separator)) {
      const [ uid, ...displayNameWithoutFirebase ] = displayNameMaybeWithFirebaseId.split(separator);

      displayName = displayNameWithoutFirebase.join('');
      firebaseId = `${uid}`;
  };

  const firebaseIdWithSeparator = firebaseId ? firebaseId + separator : '';
  
  return { firebaseId, displayName, firebaseIdWithSeparator };
}
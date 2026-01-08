import { getRemoteConfig, RemoteConfig, RemoteConfigTemplate } from 'firebase-admin/remote-config';
import { getFirebaseAdminApp } from '../app/firebase.app';

const remoteConfig = (): RemoteConfig => getRemoteConfig(getFirebaseAdminApp());

export const fetchRemoteConfigTemplate = (): Promise<RemoteConfigTemplate> =>
  remoteConfig().getTemplate();

export const publishRemoteConfigTemplate = (
  template: RemoteConfigTemplate,
): Promise<RemoteConfigTemplate> => remoteConfig().publishTemplate(template);

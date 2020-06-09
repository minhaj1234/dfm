export interface IConfigMap {
  name: 'local' | 'dev' | 'demo' | 'staging' | 'prod';
  environment: 'dev' | 'demo' | 'prod';
  proxyUri;
  rootUri: string;
}

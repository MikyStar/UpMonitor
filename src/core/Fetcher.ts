import { EndpointConfig } from '../../config/IConfig';

import pkg from '../../package.json';
import Config from './Config';

////////////////////////////////////////////////////////////////////////////////

type EndpointUrl = Pick<EndpointConfig, 'name' | 'url' | 'expectedStatusCode'>;

export type IFetcher = Fetcher;

export default class Fetcher {
  endpointsNames: string[];
  endpointsUrls: EndpointUrl[];

  constructor(config: Config) {
    this.endpointsNames = [];
    this.endpointsUrls = [];
    config.endpointsConfigs.forEach((endpoint) => {
      const { name, url, expectedStatusCode } = endpoint;

      this.endpointsNames.push(name);
      this.endpointsUrls.push({
        name,
        url,
        expectedStatusCode,
      });
    });
  }

  ping = async (endpointName: string): Promise<number> => {
    if (!this.endpointsNames.includes(endpointName))
      throw new Error(`Endpoint name '${endpointName}' not in config`);

    const { url, expectedStatusCode } = this.endpointsUrls.find(
      (endpoint) => endpoint.name === endpointName,
    );

    if (!url) throw new Error(`No URL found for '${endpointName}'`);
    if (!expectedStatusCode)
      throw new Error(`No expected status code found for '${endpointName}'`);

    const headers = new Headers({
      'User-Agent': `${pkg.name} bot`,
    });
    const response = await fetch(url, { headers });

    return response.status;
  };
}

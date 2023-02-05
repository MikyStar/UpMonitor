import { EndpointConfig } from '../../config/IConfig';

import pkg from '../../package.json';
import Config from './Config';

////////////////////////////////////////////////////////////////////////////////

type EndpointUrl = Pick<EndpointConfig, 'name' | 'url' | 'expectedStatusCode'>;

export type IFetcher = Fetcher;

export default class Fetcher {
  config: Config;
  endpointsUrls: EndpointUrl[];

  constructor(config: Config) {
    this.config = config;

    this.endpointsUrls = [];
    this.config.endpointsConfigs.forEach((endpoint) => {
      const { name, url, expectedStatusCode } = endpoint;

      this.endpointsUrls.push({
        name,
        url,
        expectedStatusCode,
      });
    });
  }

  ping = async (endpointName: string): Promise<number> => {
    const { url, expectedStatusCode } =
      this.config.findEndpointByName(endpointName);

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

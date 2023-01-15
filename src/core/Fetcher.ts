import { Config } from '../../config/config';
import { EndpointConfig, IConfig } from '../../config/IConfig';

import pkg from '../../package.json';

////////////////////////////////////////////////////////////////////////////////

type EndpointUrl = Pick<EndpointConfig, 'name' | 'url' | 'expectedStatusCode'>;

export type IFetcher = Fetcher;

class Fetcher {
  endpointsNames: string[];
  endpointsUrls: EndpointUrl[];

  constructor(config: IConfig) {
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

  isAlive = async (endpointName: string): Promise<boolean> => {
    if (!this.endpointsNames.includes(endpointName))
      throw new Error(`Endpoint name '${endpointName}' not in config`);

    const { url, expectedStatusCode } = this.endpointsUrls.find(
      (endpoint) => endpoint.name === endpointName,
    );

    if (!url) throw new Error(`No URL found for '${endpointName}'`);
    if (!expectedStatusCode)
      throw new Error(`No expected status code found for '${endpointName}'`);

    try {
      const headers = new Headers({
        'User-Agent': `${pkg.name} bot`,
      });
      const response = await fetch(url, { headers });

      return response.status === expectedStatusCode;
    } catch (e) {
      return false;
    }
  };

  getEachStatus = async () => {
    const eachStatus = await Promise.all(
      this.endpointsNames.map(async (name) => {
        return {
          name,
          isAlive: await this.isAlive(name),
        };
      }),
    );

    return eachStatus;
  };

  areAllAlive = async () => {
    const eachStatus = await this.getEachStatus();

    eachStatus.forEach(({ isAlive }) => {
      if (!isAlive) return false;
    });

    return true;
  };
}

export default new Fetcher(Config);

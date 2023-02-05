import pkg from '../../package.json';
import Config from './Config';

////////////////////////////////////////////////////////////////////////////////

export type IFetcher = Fetcher;

export default class Fetcher {
  config: Config;

  constructor(config: Config) {
    this.config = config;
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

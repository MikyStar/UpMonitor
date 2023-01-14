import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';
import { Logger } from '../core/Logger';

////////////////////////////////////////////////////////////////////////////////

type EndpointUrl = {
  name: string;
  url: string;
};

class Fetcher {
  endpointsNames: string[];
  endpointsUrls: EndpointUrl[];

  constructor(config: IConfig) {
    this.endpointsNames = [];
    this.endpointsUrls = [];
    config.endpointsConfigs.forEach((endpoint) => {
      const { name, url } = endpoint;

      if (this.endpointsNames.includes(name))
        throw new Error(`Duplicate endpoint name '${name}'`);

      this.endpointsNames.push(name);
      this.endpointsUrls.push({
        name,
        url,
      });
    });
  }

  isAlive = async (endpointName: string): Promise<boolean> => {
    if (!this.endpointsNames.includes(endpointName))
      throw new Error(`Endpoint name '${endpointName}' not in config`);

    const { url } = this.endpointsUrls.find(
      (endpoint) => endpoint.name === endpointName,
    );

    if (!url) throw new Error(`No URL found for '${endpointName}'`);

    Logger.log({ name: 'in alive' });

    return false; // TODO check if is alive and ret
  };

  areAllAlive = async () => {
    const areAllive = await Promise.all(this.endpointsNames.map(this.isAlive));

    areAllive.forEach((isAlive) => {
      if (!isAlive) return false;
    });

    return true;
  };
}

export default new Fetcher(Config);

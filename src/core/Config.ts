import { EndpointConfig, IConfig } from '../../config/IConfig';
import { ERRORS_CHANNEL, LOGS_CHANNEL } from '../handler/discord.handler';

////////////////////////////////////////

export default class Config implements IConfig {
  discordToken: string;
  logsChannelID: string;
  errorsChannelID: string;
  endpointsConfigs: EndpointConfig[];

  //////////

  constructor(config: IConfig) {
    this.checkDuplicates(config);

    Object.assign(this, config);
  }

  //////////

  findEndpointByName = (name: string) => {
    const endpoint = this.endpointsConfigs.find(
      (endpoint) => endpoint.name === name,
    );

    if (!endpoint) throw new Error(`Endpoint name '${name}' not in config`);

    return endpoint;
  };

  private checkDuplicates = (config: IConfig) => {
    const names: string[] = [LOGS_CHANNEL, ERRORS_CHANNEL];

    config.endpointsConfigs.forEach((endpoint) => {
      const { name } = endpoint;

      if (names.includes(name))
        throw new Error(`Duplicate endpoint name '${name}'`);
    });
  };
}

import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';

import { DiscordChannel } from './DiscordChannel';

////////////////////////////////////////////////////////////////////////////////

type EndpointChannel = {
  name: string;
  channel: DiscordChannel;
};

class Discord {
  errorChannel: DiscordChannel;

  endpointNames: string[];
  endpointsChannels: EndpointChannel[];

  constructor(config: IConfig) {
    this.errorChannel = new DiscordChannel(
      config.discordToken,
      config.errorsChannelID,
    );

    this.endpointNames = [];
    this.endpointsChannels = [];
    config.endpointsConfigs.forEach((endpoint) => {
      const { name, channelID } = endpoint;

      if (this.endpointNames.includes(name))
        throw new Error(`Duplicate endpoint name '${name}'`);

      this.endpointNames.push(name);

      this.endpointsChannels.push({
        name,
        channel: new DiscordChannel(config.discordToken, channelID),
      });
    });
  }

  setup = async () => {
    const connect = async (endpoint: EndpointChannel) => {
      await endpoint.channel.setup();
      console.log(`Connected to Discord channel for '${endpoint.name}'`);
    };

    await Promise.all([
      connect({ name: 'General errors', channel: this.errorChannel }),

      ...this.endpointsChannels.map(connect),
    ]);
  };

  send = async (channelName: string, content: any) => {
    if (!this.endpointNames.includes(channelName))
      throw new Error('Channel name not in config');

    const { channel } = this.endpointsChannels.find(
      (endpoint) => endpoint.name === channelName,
    );

    return channel.send(content);
  };
}

export default new Discord(Config);

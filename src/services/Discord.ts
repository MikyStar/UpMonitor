import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';

import { DiscordChannel } from './DiscordChannel';

////////////////////////////////////////////////////////////////////////////////

const LOGS_CHANNEL = 'General logs';
const ERRORS_CHANNEL = 'General errors';

////////////////////////////////////////////////////////////////////////////////

type EndpointChannel = {
  name: string;
  channel: DiscordChannel;
};

class Discord {
  errorsChannel: EndpointChannel;
  logsChannel: EndpointChannel;

  channelNames: string[];
  endpointsChannels: EndpointChannel[];

  constructor(config: IConfig) {
    this.channelNames = [LOGS_CHANNEL, ERRORS_CHANNEL];

    this.logsChannel = {
      name: LOGS_CHANNEL,
      channel: new DiscordChannel(config.discordToken, config.logChannelID),
    };
    this.errorsChannel = {
      name: ERRORS_CHANNEL,
      channel: new DiscordChannel(config.discordToken, config.errorsChannelID),
    };

    this.endpointsChannels = [];
    config.endpointsConfigs.forEach((endpoint) => {
      const { name, channelID } = endpoint;

      if (this.channelNames.includes(name))
        throw new Error(`Duplicate endpoint name '${name}'`);

      this.channelNames.push(name);

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
      connect(this.logsChannel),
      connect(this.errorsChannel),

      ...this.endpointsChannels.map(connect),
    ]);
  };

  send = async (channelName: string, content: any) => {
    if (!this.channelNames.includes(channelName))
      throw new Error('Channel name not in config');

    const { channel } = this.endpointsChannels.find(
      (endpoint) => endpoint.name === channelName,
    );

    return channel.send(content);
  };
}

export default new Discord(Config);

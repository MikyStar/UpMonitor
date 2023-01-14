import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';
import { Logger, LogMessage, LOG_DATE_FORMAT } from '../core/Logger';

import pkg from '../../package.json';
import { DateUtils } from '../utils/DateUtils';
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
  channelNames: string[];
  channels: EndpointChannel[];

  constructor(config: IConfig) {
    this.channelNames = [LOGS_CHANNEL, ERRORS_CHANNEL];
    this.channels = [
      {
        name: LOGS_CHANNEL,
        channel: new DiscordChannel(config.discordToken, config.logsChannelID),
      },
      {
        name: ERRORS_CHANNEL,
        channel: new DiscordChannel(
          config.discordToken,
          config.errorsChannelID,
        ),
      },
    ];

    // config.endpointsConfigs.forEach((endpoint) => {
    //   const { name, channelID } = endpoint;

    //   if (this.channelNames.includes(name))
    //     throw new Error(`Duplicate endpoint name '${name}'`);

    //   this.channelNames.push(name);
    //   this.channels.push({
    //     name,
    //     channel: new DiscordChannel(config.discordToken, channelID),
    //   });
    // });
  }

  setup = async () => {
    const connect = async (endpoint: EndpointChannel) => {
      await endpoint.channel.setup();

      await this.log({
        name: `Connected to Discord channel for '${endpoint.name}'`,
        level: 'info',
      });

      await this.send(endpoint.name, {
        name: `${pkg.name} bot connected`,
        level: 'info',
      });
    };

    await Promise.all(this.channels.map(connect));
  };

  log = async (content: LogMessage) => {
    Logger.log(content);
    await this.send(LOGS_CHANNEL, content);
  };

  error = async (content: LogMessage) => {
    Logger.error(content);
    await this.send(ERRORS_CHANNEL, content);
  };

  send = async (channelName: string, content: LogMessage) => {
    if (!this.channelNames.includes(channelName))
      throw new Error('Channel name not in config');

    if (!content.timestamp) {
      content.timestamp = DateUtils.getFormatedTimeStamp(LOG_DATE_FORMAT);
    }

    const { channel } = this.channels.find(
      (endpoint) => endpoint.name === channelName,
    );

    return channel.send(content);
  };
}

export default new Discord(Config);

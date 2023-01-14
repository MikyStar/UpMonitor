import { Config } from '../../config/config';
import { IConfig } from '../../config/IConfig';
import { Logger, LogMessage, LOG_DATE_FORMAT } from '../core/Logger';

import pkg from '../../package.json';
import { DateUtils } from '../utils/date.utils';
import { DiscordChannel } from './DiscordChannel';

////////////////////////////////////////////////////////////////////////////////

export const LOGS_CHANNEL = 'logs';
export const ERRORS_CHANNEL = 'errors';

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

    config.endpointsConfigs.forEach((endpoint) => {
      const { name, channelID } = endpoint;

      this.channelNames.push(name);
      this.channels.push({
        name,
        channel: new DiscordChannel(config.discordToken, channelID),
      });
    });
  }

  setup = async () => {
    const connect = async (endpoint: EndpointChannel) => {
      await endpoint.channel.setup();

      await this.info(endpoint.name, {
        name: `${pkg.name} bot connected`,
      });
    };

    await Promise.all(this.channels.map(connect));
  };

  info = async (channelName: string, content: LogMessage) => {
    if (!content.level) content.level = 'info';
    if (content?.level !== 'info') throw new Error('Bad log level');

    if (!content.timestamp) {
      content.timestamp = DateUtils.getFormatedTimeStamp(LOG_DATE_FORMAT);
    }

    const logWithName = this.appendChannelNameToLogDetails(
      channelName,
      content,
    );

    Logger.log(logWithName);
    await this.sendToChannel(LOGS_CHANNEL, logWithName);

    await this.sendToChannel(channelName, content);
  };

  error = async (channelName: string, content: LogMessage) => {
    if (!content.level) content.level = 'error';
    if (content?.level !== 'error') throw new Error('Bad log level');

    if (!content.timestamp) {
      content.timestamp = DateUtils.getFormatedTimeStamp(LOG_DATE_FORMAT);
    }

    const logWithName = this.appendChannelNameToLogDetails(
      channelName,
      content,
    );

    Logger.error(logWithName);
    await this.sendToChannel(ERRORS_CHANNEL, logWithName);

    await this.sendToChannel(channelName, content);
  };

  ////////////////////

  private sendToChannel = async (channelName: string, content: LogMessage) => {
    if (!this.channelNames.includes(channelName))
      throw new Error(`Channel name '${channelName}' not in config`);

    const { channel } = this.channels.find(
      (endpoint) => endpoint.name === channelName,
    );

    if (!channel)
      throw new Error(`No DiscordChannel found for '${channelName}'`);

    return channel.send(content);
  };

  private appendChannelNameToLogDetails = (
    channelName: string,
    log: LogMessage,
  ): LogMessage => {
    return {
      ...log,
      details: {
        ...log.details,
        channelName,
      },
    };
  };
}

export default new Discord(Config);

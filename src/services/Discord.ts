import { Client, TextChannel } from 'discord.js';

import Environment from '../core/Environment';
import { Logger } from '../core/Logger';
import { StringUtils } from '../utils';

////////////////////////////////////////////////////////////////////////////////

const DISCORD_MAX_BODY_CHAR = 2_000;

////////////////////////////////////////////////////////////////////////////////

/**
 * @description Send logs to discord channel, alerts and CLI
 */
class Discord {
  isConnected: boolean;

  client: Client;

  token: string;
  channelID: string;

  channel: TextChannel;

  constructor(token: string, channelID: string) {
    this.isConnected = false;

    this.client = new Client({
      intents: [],
    });

    this.token = token;

    this.channelID = channelID;

    this.client.on('error', (error) => {
      console.log(`error ${error}!`);
    });
  }

  setup = async () => {
    return new Promise(async (resolve) => {
      this.client.on('ready', async () => {
        await this.client.channels.fetch(this.channelID);
        this.channel = this.client.channels.cache.get(
          this.channelID,
        ) as TextChannel;

        Logger.log({ name: 'Discord bot connected' });

        this.isConnected = true;
        resolve(true);
      });

      await this.client.login(this.token);
    });
  };

  send = async (content: any) => {
    const stringPayload = this.handlePayload(content);
    const chunks = StringUtils.splitEveryNChar(
      stringPayload,
      DISCORD_MAX_BODY_CHAR,
    );

    for (const chunk of chunks) await this.channel.send(chunk);
  };

  private handlePayload = (content: any) => {
    if (typeof content === 'string') return content;

    return '```json\n' + JSON.stringify(content, null, 4) + '\n```';
  };
}

////////////////////////////////////////////////////////////////////////////////

export default new Discord(
  Environment.DISCORD_TOKEN,
  Environment.DISCORD_CHANNEL_ID,
);

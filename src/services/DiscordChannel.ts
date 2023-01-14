import { Client, TextChannel } from 'discord.js';

import { StringUtils } from '../utils/StringUtils';

////////////////////////////////////////////////////////////////////////////////

const DISCORD_MAX_BODY_CHAR = 2_000;

////////////////////////////////////////////////////////////////////////////////

/**
 * @description Send logs to discord channel, alerts and CLI
 */
export class DiscordChannel {
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

  setup = async (): Promise<void> => {
    return new Promise(async (resolve) => {
      this.client.on('ready', async () => {
        await this.client.channels.fetch(this.channelID);
        this.channel = this.client.channels.cache.get(
          this.channelID,
        ) as TextChannel;

        this.isConnected = true;
        resolve();
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

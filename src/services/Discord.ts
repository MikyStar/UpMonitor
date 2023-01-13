import { Client, TextChannel } from 'discord.js'

import Environment from '../core/Environment';
import { Logger } from '../core/Logger';
import { StringUtils } from '../utils';


////////////////////////////////////////////////////////////////////////////////

export type Channel = 'log' | 'error'

const DISCORD_MAX_BODY_CHAR = 2_000

////////////////////////////////////////////////////////////////////////////////

/**
 * @description Send logs to discord channel, alerts and CLI
 */
class Discord
{
	isConnected: boolean

	client: Client

	token: string
	logChannelID: string
	errorChannelID: string

	logChannel: TextChannel
	errorChannel: TextChannel

	constructor(token: string, logChannelID: string, errorChannelID: string)
	{
		this.isConnected = false

		this.client = new Client({
			intents: []
		})

		this.token = token

		this.logChannelID = logChannelID
		this.errorChannelID = errorChannelID

		this.client.on("error", (error) =>
		{
			console.log(`error ${error}!`)
		})
	}

	setup = async () =>
	{
		return new Promise( async (resolve, reject) =>
		{
			this.client.on("ready", async () =>
			{
				await this.client.channels.fetch(this.logChannelID)
				this.logChannel = ( this.client.channels.cache.get(this.logChannelID) as TextChannel )

				await this.client.channels.fetch(this.errorChannelID)
				this.errorChannel = ( this.client.channels.cache.get(this.errorChannelID) as TextChannel )

				Logger.log({ name: 'Discord bot connected' })

				this.isConnected = true
				resolve(true)
			})

			await this.client.login(this.token)
		})
	}

	/**
	 * Sends messages to logging channel
	 */
	log = async (content: any) => await this.send('log', content)

	/**
	 * Sends messages in alerting channel
	 */
	alert = async (content: any) =>
	{
		await this.send('error', content)
		await this.send('log', content)
	}

	private send = async (channelName: Channel, content: any) =>
	{
		const channel = channelName === 'log' ? this.logChannel : this.errorChannel

		const stringPayload = this.handlePayload(content)
		const chunks = StringUtils.splitEveryNChar(stringPayload, DISCORD_MAX_BODY_CHAR)

		for(const chunk of chunks)
			await channel.send(chunk)
	}

	private handlePayload = (content: any) =>
	{
		if(typeof content === 'string')
			return content

		return '```json\n' + JSON.stringify(content, null, 4) + '\n```'
	}
}

////////////////////////////////////////////////////////////////////////////////

export default new Discord(
	Environment.DISCORD_TOKEN,
	Environment.DISCORD_LOG_CHANNEL_ID,
	Environment.DISCORD_ERROR_CHANNEL_ID
);

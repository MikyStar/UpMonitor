import Environment, { NODE_ENV_TYPE } from './Environment';
import { DateUtils } from '../utils'
import { UserConnection } from '../middlewares/ServerMiddleware'
import Discord from '../services/Discord';

////////////////////////////////////////

export const LOG_DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss.SSS'

////////////////////////////////////////

export interface LogMessage
{
	name: string,
	level ?: LogLevel,
	timestamp ?: string,
	// TODO add GMT
	client ?: UserConnection,
	requestID ?: string,
	details ?: any,
}

export type LogLevel = 'error' | 'warning' | 'info'

interface LogRetryParams
{
	tryIndex: number
	error: any
	client ?: UserConnection
	maxRetries ?: number
}

////////////////////////////////////////

export namespace Logger
{
	/**
	 * @description Print the message
	 */
	export const log = ( log: LogMessage ) =>
	{
		if( !Environment.VERBOSE )
			return

		const level = log.level || 'info'

		if( Object.keys( { ...log.details } ).length === 0 )
			delete log.details

		/////

		const toLog : LogMessage =
		{
			name: log.name,
			level,
			timestamp: DateUtils.getFormatedTimeStamp( LOG_DATE_FORMAT ),
			requestID: log.requestID,
			...log,
		}

		if( !log.requestID )
			delete toLog.requestID

		const formatedJSON = require( 'util' ).inspect( toLog, { depth: null, showHidden: false } )
		const finalLog = Environment.IS_STRING_LOG ? JSON.stringify( toLog ) : formatedJSON

		level === 'error' ? console.error( finalLog ) : console.log( finalLog )

		if (Environment.DISCORD_ENABLED && Discord.isConnected)
		{
			level === 'error'
				? Discord.alert(toLog).then(() => {})
				: Discord.log(toLog).then(() => {})
		}
	}

	/**
	 * @description Logger handler for retry Promise
	 */
	export const logRetry = ( params: LogRetryParams) =>
	{
		// TODO use request.log and addLogDetail instead
		const { tryIndex, error, client, maxRetries = Environment.MAX_RETRIES  } = params

		const toLog: Partial<LogMessage> =
		{
			client,
			details: { retryNumber: tryIndex, error }
		}

		if(!client)
			delete toLog.client

		if( tryIndex !== maxRetries )
		{
			Logger.log(
			{
				...toLog,
				name: 'Retrying',
				level: 'warning',
			})
		}
		else
		{
			Logger.log(
			{
				...toLog,
				name: 'Error on last retry',
				level: 'error',
			})
		}
	}
}

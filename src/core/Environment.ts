import * as dotenv from 'dotenv';
import path from 'path';

import { EnvVarMissingError } from '../errors/EnvironmentErrors';

////////////////////////////////////////////////////////////////////////////////

dotenv.config({
	path: process.env.NODE_ENV === 'dev' && path.resolve(process.cwd(), 'environments/.env.local')
});

////////////////////////////////////////////////////////////////////////////////

interface TestAccount
{
	mail: string,
	password: string
}

export type TogglableFeatures = 'authentication'

export type NODE_ENV_TYPE = 'dev' | 'staging' | 'production' | 'test'

////////////////////////////////////////////////////////////////////////////////

/**
 * @description Handles the required environment variables are in the sytstem
 *
 * @see docs/Environment.md
 */
class Env
{
	NODE_ENV: NODE_ENV_TYPE

	SERVER_PORT: number
	SSL_CRT_FILE: string
	SSL_KEY_FILE: string

	STUBBED_DATAS : boolean
	VERBOSE : boolean
	IS_STRING_LOG : boolean

	DISABLED_FEATURES : string[]

	MAX_RETRIES: number
	RETRY_WAIT: string

	CPP_URL: string
	CPP_PORT: number

	DB_USER: string
	DB_PWD: string
	DB_NAME: string
	DB_URL: string

	JWT_SECRET: string
	COOKIE_TOKEN_EXPIRATION: string
	COOKIE_TOKEN_SECRET: string
	BCRYPT_SALT_ROUNDS: number

	CORS_ALLOWED_ORIGINS: string[]

	RATE_LIMIT_WINDOW_MS: number
	RATE_LIMIT_MAX_CONNECTIONS: number

	DISCORD_ENABLED: boolean
	DISCORD_TOKEN: string
	DISCORD_LOG_CHANNEL_ID: string
	DISCORD_ERROR_CHANNEL_ID: string

	VALIDATED_TEST_ACCOUNT ?: TestAccount
	NOT_VALIDATED_TEST_ACCOUNT ?: TestAccount
	NEW_TEST_ACCOUNT ?: TestAccount

	////////////////////

	constructor()
	{
		if( !process.env.NODE_ENV )
			throw new EnvVarMissingError( 'NODE_ENV' )
		else
			this.NODE_ENV = process.env.NODE_ENV as NODE_ENV_TYPE

		const requiredVariables =
		[
			"CPP_URL", "CPP_PORT", "SERVER_PORT",
			"DB_USER", "DB_PWD", "DB_NAME", "DB_URL", "JWT_SECRET",
			"BCRYPT_SALT_ROUNDS", "COOKIE_TOKEN_SECRET",
			"CORS_ALLOWED_ORIGINS", "MAX_RETRIES", "RETRY_WAIT",
			"COOKIE_TOKEN_EXPIRATION", "SSL_CRT_FILE", "SSL_KEY_FILE",
			"DISCORD_ENABLED", "DISCORD_TOKEN", "DISCORD_LOG_CHANNEL_ID",
			"DISCORD_ERROR_CHANNEL_ID", "RATE_LIMIT_WINDOW_MS",
			"RATE_LIMIT_MAX_CONNECTIONS"
		]

		requiredVariables.forEach( variable =>
		{
			const matchingVarInEnv = process.env[ variable ]

			if( matchingVarInEnv === undefined )
				throw new EnvVarMissingError( variable )
			else
			{
				const csvToParseArray = [ 'CORS_ALLOWED_ORIGINS' ]
				const numberToParse = [ 'SERVER_PORT', 'MAX_RETRIES',
					'SOLVER_PORT', 'TRAINER_PORT', 'BCRYPT_SALT_ROUNDS',
					'RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_CONNECTIONS' ]
				const booleanToParse = [ 'DISCORD_ENABLED' ]

				if( csvToParseArray.includes( variable ) )
					this[ variable ] = matchingVarInEnv.split( ',' )
				else if( numberToParse.includes( variable ) )
					this[ variable ] = Number.parseInt( matchingVarInEnv )
				else if( booleanToParse.includes( variable ) )
					this[ variable ] = matchingVarInEnv === 'true'
				else
					this[ variable ] = matchingVarInEnv
			}
		});

		if( this.NODE_ENV === 'test' )
		{
			const specificTestVariables =
			[
				'VALIDATED_TEST_ACCOUNT', 'NOT_VALIDATED_TEST_ACCOUNT',
				'NEW_TEST_ACCOUNT'
			]

			specificTestVariables.forEach( variable =>
			{
				if( process.env[ variable ] === undefined )
					throw new EnvVarMissingError( variable )
				else
					this[ variable ] = JSON.parse( process.env[ variable ] )
			});
		}

		////////////////////

		// Non-required variables
		this.STUBBED_DATAS = process.env?.STUBBED_DATAS === 'true'
		this.VERBOSE = process.env?.VERBOSE === 'true'
		this.IS_STRING_LOG = process.env?.IS_STRING_LOG === 'true'
		this.DISABLED_FEATURES = process.env.DISABLED_FEATURES?.split( ', ' ) || []
	}

	public isFeatureDisabled = ( feat: TogglableFeatures ) => this.DISABLED_FEATURES.includes( feat )
}

////////////////////////////////////////////////////////////////////////////////

export default new Env();

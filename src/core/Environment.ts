import * as dotenv from 'dotenv';

import { EnvVarMissingError } from '../errors/EnvironmentErrors';

////////////////////////////////////////////////////////////////////////////////

dotenv.config();

////////////////////////////////////////////////////////////////////////////////

export type NODE_ENV_TYPE = 'dev' | 'staging' | 'production' | 'test';

////////////////////////////////////////////////////////////////////////////////

/**
 * @description Handles the required environment variables are in the sytstem
 *
 * @see docs/Environment.md
 */
class Env {
  NODE_ENV: NODE_ENV_TYPE;

  MAX_RETRIES: number;
  RETRY_WAIT: string;

  DISCORD_ENABLED: boolean;
  DISCORD_TOKEN: string;
  DISCORD_LOG_CHANNEL_ID: string;
  DISCORD_ERROR_CHANNEL_ID: string;

  ////////////////////

  constructor() {
    if (!process.env.NODE_ENV) throw new EnvVarMissingError('NODE_ENV');
    else this.NODE_ENV = process.env.NODE_ENV as NODE_ENV_TYPE;

    const requiredVariables = [
      'MAX_RETRIES',
      'RETRY_WAIT',
      'DISCORD_ENABLED',
      'DISCORD_TOKEN',
      'DISCORD_LOG_CHANNEL_ID',
      'DISCORD_ERROR_CHANNEL_ID',
    ];

    requiredVariables.forEach((variable) => {
      const matchingVarInEnv = process.env[variable];

      if (matchingVarInEnv === undefined)
        throw new EnvVarMissingError(variable);
      else {
        const numberToParse = ['MAX_RETRIES'];
        const booleanToParse = ['DISCORD_ENABLED'];

        if (numberToParse.includes(variable))
          this[variable] = Number.parseInt(matchingVarInEnv);
        else if (booleanToParse.includes(variable))
          this[variable] = matchingVarInEnv === 'true';
        else this[variable] = matchingVarInEnv;
      }
    });
  }
}

////////////////////////////////////////////////////////////////////////////////

export default new Env();

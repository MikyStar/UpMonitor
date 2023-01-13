import { CatchableError } from './CatchableError';

////////////////////////////////////////

export class EnvVarMissingError extends CatchableError {
  constructor(envVarName: string) {
    super(`Environment variable '${envVarName}' is missing`);
  }
}

import { CatchableError } from './CatchableError';

////////////////////////////////////////

export class UnreachableError extends CatchableError
{
	constructor( url: string, error ?: any )
	{
		super( `URL '${url}' is unreachable`, error )
	}
}

export class Not200Error extends CatchableError
{
	constructor( url: string, code: number, error ?: any )
	{
		super( `URL '${url}' responded with code '${code}'`, error )
	}
}

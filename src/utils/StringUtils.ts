export class StringUtils
{
	/**
	 * @description Encode in base 64 and retrieves 10 first numbers
	 */
	static encodeAndTrim = ( txt: string ) =>
	{
		if( !txt )
			return undefined
		else
			return Buffer.from( txt ).toString( 'base64' ).slice( 0, 10 )
	}

	/**
	 * @see: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
	 */
	static generateID = ( length : number = 10 ) =>
	{
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for ( let i = 0; i < length; i++ )
			result += characters.charAt( Math.floor( Math.random() * characters.length ) );

		return result;
	}


	/** @see : https://stackoverflow.com/a/6259543 */
	static splitEveryNChar = ( txt: string, n: number ) => txt.match( new RegExp( '[\\s\\S]{1,' + n + '}', 'g' ) );
}
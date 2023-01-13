import moment from 'moment';

////////////////////////////////////////

export class DateUtils
{
	static getFormatedTimeStamp = ( format: string ) => moment().format( format )

	/**
	 * @param timeFormated Format 'HH:mm:ss'
	 */
	static computeTime = ( timeFormated: string, to : 'seconds' | 'milliseconds' ) =>
		moment( timeFormated, 'HH:mm:ss' ).diff( moment().startOf( 'day' ), to );
}
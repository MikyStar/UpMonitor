export class ArrayUtils
{
	/** @see: From https://stackoverflow.com/questions/840781/get-all-non-unique-values-i-e-duplicate-more-than-one-occurrence-in-an-array */
	static findDuplicates = <T>( arr : T[] ) =>
	{
		let sorted_arr = arr.slice().sort();

		let results: T[] = [];
		for (let i = 0; i < sorted_arr.length - 1; i++)
		{
			if (sorted_arr[i + 1] == sorted_arr[i])
				results.push(sorted_arr[i]);
		}

		return results;
	}
}
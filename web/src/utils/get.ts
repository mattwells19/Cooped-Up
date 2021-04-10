/**
 * This function is a wrapper that handles the json conversion and error catching for you for API calls.
 * @param endpoint The API endpoint to contact
 */
export default async function get<T>(endpoint: string): Promise<T> {
	return fetch(`/api/${endpoint}`, {
		method: "GET",
	})
		.then((data) => data.json() as Promise<T>)
		.catch((err) => {
			throw Error(err);
		});
}

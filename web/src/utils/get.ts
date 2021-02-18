/**
 * This function is a wrapper for fetch calls to the API that
 * handles the json conversion and error catching fro you.
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

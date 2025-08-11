interface Success<T> {
  data: T;
  error?: never;
}
interface Failure<E> {
  data?: never;
  error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;
/** Implements try/catch for a given promise.
 *
 * If the promise resolves, returns an object with a `data` property. If the promise rejects, returns an object with an `error` property.
 * @template E - the type of error to return. Defaults to `Error`.
 * @param promise - the promise to implement try/catch for.
 * @example
 * const { data, error } = await tryCatch(getData());
 * if (error) return; // handle the error
 * doSomething(data); // data can now be used
 */
async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    return { error: error as E };
  }
}

/** Makes a request to the given endpoint with the given method and body.
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 */
async function requestEndpoint(endpoint: string, method?: string, body?: object): Promise<void>;
/** Makes a request to the given endpoint with the given method and body.
 * @template T - the type of the request's response
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 * @returns the JSON response from the request.
 */
async function requestEndpoint<T>(endpoint: string, method?: string, body?: object): Promise<T>;
async function requestEndpoint<T>(endpoint: string, method?: string, body?: object): Promise<T | void> {
  //const config = useRuntimeConfig();
  const baseUrl = "/api"; // TODO: use config.public.backend instead of hardcoding the base URL

  const options: RequestInit = { credentials: "include" };
  if (method) {
    options.method = method;
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const res = await fetch(baseUrl + endpoint, options);
  if (!res.ok) throw new Error(res.statusText);

  const contentLength = res.headers.get("Content-Length");
  if (contentLength === "0") return undefined as T;

  return res.json();
}

/** **Serves as a wrapper for `tryCatch(requestEndpoint())`.**
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 */
export async function tryRequestEndpoint(endpoint: string, method?: string, body?: object): Promise<Result<void>>;
/** **Serves as a wrapper for `tryCatch(requestEndpoint())`.**
 * @template T - the type of the request's response
 * @param endpoint - the endpoint to request. Should start with `/`.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 * @returns the JSON response from the request.
 */
export async function tryRequestEndpoint<T, K = Error>(endpoint: string, method?: string, body?: object): Promise<Result<T, K>>;
export async function tryRequestEndpoint<T, K = Error>(endpoint: string, method?: string, body?: object): Promise<Result<T | void, K>> {
  return tryCatch<T, K>(requestEndpoint<T>(endpoint, method, body));
}

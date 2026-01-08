/**
 * BFF API Client Helper
 *
 * Use this instead of axiosAuth for all authenticated API calls.
 * NO tokens exposed to client - all authentication handled server-side.
 */

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Make authenticated API call through BFF
 * @param endpoint - Next.js API route (e.g., '/api/users/current-user')
 * @param options - Request options
 */
export async function bffFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // Include cookies
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.message || error.error || "Request failed");
  }

  return response.json();
}

/**
 * React Query / TanStack Query helper
 *
 * Usage:
 * const { data } = useQuery({
 *   queryKey: ['user-profile'],
 *   queryFn: () => bffQuery('/api/users/current-user')
 * });
 */
export const bffQuery = <T = any>(endpoint: string) => bffFetch<T>(endpoint);

/**
 * React Query Mutation helper
 *
 * Usage:
 * const mutation = useMutation({
 *   mutationFn: (data) => bffMutation('/api/users/current-user', { body: data, method: 'PATCH' })
 * });
 */
export const bffMutation = <T = any>(
  endpoint: string,
  options: Omit<ApiOptions, "method"> & {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
  }
) => bffFetch<T>(endpoint, options);

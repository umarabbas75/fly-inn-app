/**
 * Centralized query key factory and constants for listing API.
 * Provides consistent keys for react-query cache management.
 */
const queryKeys = {
  listing: {
    all: ['listings'] as const,
    byId: (id: string) => [...queryKeys.listing.all, id] as const,
  },
};

export { queryKeys };

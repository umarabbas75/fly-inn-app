/**
 * Example: How to use BFF in your components
 *
 * BEFORE (with axiosAuth):
 * import axiosAuth from '@/utils/axiosAuth';
 * const response = await axiosAuth.get('/users/me');
 *
 * AFTER (with BFF):
 * import { bffQuery, bffMutation } from '@/lib/bff-client';
 * const response = await bffQuery('/api/users/current-user');
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bffQuery, bffMutation } from "@/lib/bff-client";

// ============================================
// Example 1: Fetching User Profile
// ============================================

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => bffQuery("/api/users/current-user"),
  });
}

// Usage in component:
// const { data: user, isLoading, error } = useUserProfile();

// ============================================
// Example 2: Updating User Profile
// ============================================

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      bffMutation("/api/users/current-user", {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

// Usage in component:
// const mutation = useUpdateProfile();
// mutation.mutate({ first_name: 'John' });

// ============================================
// Example 3: Fetching User Listings
// ============================================

export function useUserListings() {
  return useQuery({
    queryKey: ["user-listings"],
    queryFn: () => bffQuery("/api/listings/my-listings"),
  });
}

// ============================================
// Example 4: Creating a Listing
// ============================================

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingData: any) =>
      bffMutation("/api/listings", {
        method: "POST",
        body: listingData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
    },
  });
}

// ============================================
// Example 5: Direct fetch (outside React Query)
// ============================================

import { bffFetch } from "@/lib/bff-client";

export async function fetchUserDirectly() {
  try {
    const user = await bffFetch("/api/users/current-user");
    console.log(user);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

// ============================================
// Key Benefits:
// ============================================
//
// 1. ✅ No tokens in browser
// 2. ✅ No token management needed
// 3. ✅ Rate limiting built-in
// 4. ✅ Real endpoints hidden
// 5. ✅ Simpler client code
// 6. ✅ More secure

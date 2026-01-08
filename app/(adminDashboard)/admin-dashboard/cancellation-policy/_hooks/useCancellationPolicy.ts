import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useApiGet, useApiMutation } from "@/http-service";

interface CancellationPolicy {
  id: number;
  group_name: string;
  type: string;
  before_check_in: string;
  after_check_in: string;
}

interface CancellationPolicyFormData {
  group_name: string;
  type: string;
  before_check_in: string;
  after_check_in: string;
}

// Get all cancellation policies
export const useGetCancellationPolicies = () => {
  const { data: session } = useSession();

  return useApiGet({
    endpoint: "/api/admin/cancellation-policy",
    queryKey: ["cancellation-policies"],
    config: {
      enabled: !!session,
    },
  });
};

// Get single cancellation policy
export const useGetCancellationPolicy = (id: string | undefined) => {
  return useApiGet({
    endpoint: `/api/admin/cancellation-policy/${id}`,
    queryKey: ["sing-cancellation", id],
    config: {
      enabled: !!id,
      select: (data: any) => data?.data || data,
    },
  });
};

// Create cancellation policy
export const useCreateCancellationPolicy = () => {
  const queryClient = useQueryClient();

  return useApiMutation({
    endpoint: "/api/admin/cancellation-policy",
    method: "post",
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cancellation-policies"] });
        queryClient.invalidateQueries({ queryKey: ["sing-cancellation"] });
        toast.success("Cancellation policy created successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to create cancellation policy"
        );
      },
    },
  });
};

// Update cancellation policy
export const useUpdateCancellationPolicy = (id: string) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    endpoint: `/api/admin/cancellation-policy/${id}`,
    method: "put",
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cancellation-policies"] });
        queryClient.invalidateQueries({ queryKey: ["sing-cancellation"] });
        queryClient.invalidateQueries({
          queryKey: ["cancellation-policy", id],
        });
        toast.success("Cancellation policy updated successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update cancellation policy"
        );
      },
    },
  });
};

// Delete cancellation policy
export const useDeleteCancellationPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { default: axiosAuth } = await import("@/utils/axiosAuth");
      const response = await axiosAuth.delete(
        `/api/admin/cancellation-policy/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancellation-policies"] });
      toast.success("Cancellation policy deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete cancellation policy"
      );
    },
  });
};

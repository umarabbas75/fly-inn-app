/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultSelect = (data: any) => data?.data;
export default function QueryProvider({ children }: any) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // default: true
            select: defaultSelect,
            retry: false,
          },
        },
        //mutationCache,
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

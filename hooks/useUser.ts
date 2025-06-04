import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User } from "@/types/user";

export function useUser(): UseQueryResult<User | null, Error> {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/me");

      // Don't throw for 404s - return null instead
      if (res.status === 404) {
        return null;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const user = await res.json();
      return user;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
  });
}

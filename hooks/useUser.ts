// Example: hooks/useUser.ts
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/user/me", fetcher);
  return {
    user: data,
    isLoading,
    isError: error,
    refreshUser: mutate, // call this manually after transcription or webhook
  };
};

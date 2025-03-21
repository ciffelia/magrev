import type { InferResponseType } from "hono";

import { useCallback } from "react";
import useSWR from "swr";

import { buildAuthHeaders, useAuth } from "./auth";
import { useClient } from "./client-provider";
import { HttpError } from "./error";

const endpoint = "GET /api/v1/run";

export const useRuns = () => {
  const client = useClient();
  const { token } = useAuth();

  const fetcher = useCallback(
    async ([_url, token]: [string, string]) => {
      const res = await client.api.v1.run.$get(undefined, {
        headers: buildAuthHeaders(token),
      });

      if (!res.ok) {
        throw new HttpError(endpoint, res);
      }

      return await res.json();
    },
    [client],
  );

  return useSWR<InferResponseType<typeof client.api.v1.run.$get>, unknown>(
    [endpoint, token],
    fetcher,
  );
};

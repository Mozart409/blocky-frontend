import type { FC } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { flushCache } from "../utils/api";
export const FlushCache: FC = () => {
  const mutationRefresh = useMutation(
    async () => {
      return await flushCache();
    },
    {
      onSuccess: () => {
        toast.success("Cached flushed!");
      },

      onError: () => {
        toast.error("Error! flushing the cache failed.");
      },
    },
  );

  return (
    <>
      <div className="prose prose-lg prose-slate dark:prose-invert">
        <h2>Flush cache</h2>
      </div>
      <button
        type="button"
        onClick={() => {
          mutationRefresh.mutate();
        }}
        className="flex p-2 rounded-md bg-sky-500 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span className="text-white">Flush cache</span>
      </button>
    </>
  );
};

import type { FC } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { refreshLists } from "../utils/api";
export const RefreshList: FC = () => {
  const mutationRefresh = useMutation(
    async () => {
      return await refreshLists();
    },
    {
      onSuccess: () => {
        toast.success("Refreshed!");
      },

      onError: () => {
        toast.error("Error! Refreshing the list failed.");
      },
    },
  );

  return (
    <>
      <div className="prose prose-lg prose-slate dark:prose-invert">
        <h2>Refresh Block List</h2>
      </div>
      <button
        type="button"
        onClick={() => {
          mutationRefresh.mutate();
        }}
        className="flex p-2 rounded-md bg-sky-500 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <span className="text-white">Refresh Lists</span>
      </button>
    </>
  );
};

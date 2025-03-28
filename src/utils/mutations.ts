import { useMutation, useQueryClient } from "react-query";
import { disableBlocking, enableBlocking } from "./api";

const queryClient = useQueryClient();

export const mutationEnable = useMutation(
  async () => {
    return await enableBlocking();
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries("blocking");
    },
  },
);

export const mutationDisable = useMutation(
  async () => {
    return await disableBlocking();
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries("blocking");
    },
  },
);

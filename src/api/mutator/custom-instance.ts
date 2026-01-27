import axios from "axios";

const BASEURL = "/api";

export const customInstance = async <T>({
  url,
  method,
  params,
  data,
  headers,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
}): Promise<T> => {
  const response = await axios({
    url: `${BASEURL}${url}`,
    method,
    params,
    data,
    headers,
  });

  return response.data;
};

export default customInstance;

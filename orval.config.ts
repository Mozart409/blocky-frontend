import { defineConfig } from "orval";

export default defineConfig({
  blocky: {
    input: "http://localhost:4000/docs/openapi.yaml",
    output: {
      mode: "tags-split",
      target: "src/api/endpoints",
      schemas: "src/api/schemas",
      client: "react-query",
      httpClient: "axios",
      baseUrl: "/api",
      override: {
        // The `query` operation would otherwise generate a hook named `useQuery`,
        // colliding with react-query's own `useQuery`. Rename it to `dnsQuery`.
        operationName: (operation, _route, _verb) =>
          operation.operationId === "query" ? "dnsQuery" : operation.operationId,
        operations: {
          query: {
            mutator: undefined,
            query: {
              useQuery: false,
            },
          },
        },
      },
    },
  },
});

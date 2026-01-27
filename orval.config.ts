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

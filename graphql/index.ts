import { makeSchema } from "nexus";
import * as types from "./types";
import path from "path";

// generates the schema from the types defined in TypeScript code.
export const schema = makeSchema({
  // load in the types for the graphql schema
  types,
  outputs: {
    typegen: path.join(
      process.cwd(),
      "node_modules",
      "@types",
      "nexus-typegen",
      "index.d.ts"
    ),
    schema: path.join(process.cwd(), "graphql", "schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: path.join(process.cwd(), "graphql", "context.ts"),
  },
});

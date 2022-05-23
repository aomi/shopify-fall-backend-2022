import { createServer } from "@graphql-yoga/node";
import { NextApiRequest, NextApiResponse } from "next";

import { schema } from "../../graphql";
import { createContext } from "../../graphql/context";

// integration with Next.js for GraphQL server works better than Apollo Server in testing.
// https://www.graphql-yoga.com/docs/integrations/integration-with-nextjs
const server = createServer<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  context: createContext,
});

export default server;

import { objectType } from "nexus";

export const MutationError = objectType({
  name: "Error",
  definition(t) {
    t.string("message", {
      description: "The error message",
    });
  },
});

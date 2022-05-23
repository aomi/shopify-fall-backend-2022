import { Kind } from "graphql";
import { scalarType } from "nexus";

export const DateScalar = scalarType({
  name: "Date",
  asNexusMethod: "date",
  description: "Date custom scalar type.",
  parseValue(value: string): Date {
    return new Date(value);
  },

  serialize(value: Date | string) {
    return value instanceof Date
      ? value.toISOString()
      : new Date(value).toISOString();
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    return null;
  },
});

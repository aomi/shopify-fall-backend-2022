import { Kind, ValueNode } from "graphql";
import { DateScalar } from "../Date";

describe("Date scaler type", () => {
  const { parseValue, parseLiteral, serialize } = DateScalar.value;

  it("should parse a date string", () => {
    if (!parseValue) {
      throw new Error("parseValue is not implemented");
    }
    expect(parseValue("2020-01-01")).toEqual(new Date("2020-01-01"));
  });

  it("should serialize a date object", () => {
    if (!serialize) {
      throw new Error("serialize is not implemented");
    }
    expect(serialize(new Date("2020-01-01"))).toEqual(
      new Date("2020-01-01").toISOString()
    );
  });

  it("should serialize a date string", () => {
    if (!serialize) {
      throw new Error("serialize is not implemented");
    }

    expect(serialize("2020-01-01")).toEqual(
      new Date("2020-01-01").toISOString()
    );
  });

  it("should parseLiteral null if the value is not a int", () => {
    if (!parseLiteral) {
      throw new Error("parseLiteral is not implemented");
    }

    const ast: ValueNode = {
      kind: Kind.STRING,
      value: new Date("2020-01-01") as any,
    };

    expect(parseLiteral(ast)).toEqual(null);
  });

  it("should parseLiteral a date if the value is a int", () => {
    if (!parseLiteral) {
      throw new Error("parseLiteral is not implemented");
    }

    const date = new Date("2020-01-01");
    const ast: ValueNode = {
      kind: Kind.INT,
      //   time as integer
      value: date.toISOString() as any,
    };
    expect(parseLiteral(ast)).toEqual(date);
  });
});

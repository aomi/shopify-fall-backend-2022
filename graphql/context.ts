import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";

export type Context = {
  prisma: PrismaClient;
};

// the following is to prevent during development instantiating a new context for every new reload of code

export async function createContext({ req, res }): Promise<Context> {
  return { prisma };
}

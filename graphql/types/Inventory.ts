import {
  objectType,
  extendType,
  inputObjectType,
  nonNull,
  unionType,
} from "nexus";

export const Inventory = objectType({
  name: "Inventory",
  definition(t) {
    t.nonNull.string("id", {
      description: "The unique identifier for the inventory item.",
    });
    t.nonNull.string("name", {
      description: "The name of the inventory item.",
    });
    t.string("description", {
      description: "The description of the inventory item.",
    });
    t.nonNull.date("createdAt", {
      description: "The date the inventory item was created.",
    });
    t.nonNull.date("updatedAt", {
      description: "The date the inventory item was last updated.",
    });
    t.date("deletedAt", {
      description: "The date the inventory item was deleted.",
    });
    t.string("image", {
      description: "Optional image URL of the item",
    });
    t.int("price", {
      description: "Price in cents",
    });
    t.int("quantity", {
      description: "Quantity in stock",
    });
    t.list.field("metadata", {
      type: "InventoryMetadata",
      description: "Metadata for the inventory item",
      resolve: async (parent, _args, ctx) => {
        const data = await ctx.prisma.inventoryMetadata.findMany({
          where: { inventoryId: parent.id ?? "" },
          orderBy: { createdAt: "desc" },
        });
        return data;
      },
    });
  },
});

export const InventoryQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("inventory", {
      type: "Inventory",
      async resolve(_parent, _args, ctx) {
        const data = await ctx.prisma.inventory.findMany();
        return data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            deletedAt: item.deletedAt,
          };
        });
      },
    });
  },
});

export const CreateInventoryInput = inputObjectType({
  name: "CreateInventoryInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.string("image");
    t.nonNull.int("price");
    t.nonNull.int("quantity");
  },
});

export const CreateInventoryMutationResult = unionType({
  name: "CreateInventoryMutationResult",
  resolveType: (value) => ("message" in value ? "Error" : "Inventory"),
  definition: (t) => t.members("Inventory", "Error"),
});

// Create a new inventory item
export const CreateInventoryMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createInventory", {
      // corresponds to the return type of the mutation
      type: "CreateInventoryMutationResult",
      args: {
        input: nonNull(CreateInventoryInput),
      },
      async resolve(_parent, args, ctx) {
        const { input } = args;
        try {
          if (input.quantity < 0) {
            throw new Error("Quantity must be greater than 0");
          }

          const data = await ctx.prisma.inventory.create({
            data: {
              name: input.name,
              description: input.description,
              price: input.price,
              quantity: input.quantity,
              image: input.image,
            },
          });
          return data;
        } catch (e) {
          return {
            message: e.message,
          };
        }
      },
    });
  },
});

export const UpdateInventoryInput = inputObjectType({
  name: "UpdateInventoryInput",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("description");
    t.string("image");
    t.int("price");
    t.int("quantity");
  },
});

export const UpdateInventoryResult = unionType({
  name: "UpdateInventoryResult",
  resolveType: (value) => ("message" in value ? "Error" : "Inventory"),
  definition: (t) => t.members("Inventory", "Error"),
});

// Update an inventory item
export const UpdateInventoryMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateInventory", {
      type: "UpdateInventoryResult",
      args: {
        input: nonNull("UpdateInventoryInput"),
      },
      async resolve(_parent, args, ctx) {
        try {
          const { input } = args;
          if (input?.quantity && input.quantity < 1) {
            throw new Error("Quantity must be greater than 0");
          }

          const data = await ctx.prisma.inventory.update({
            where: {
              id: input.id ?? "",
            },
            data: {
              name: input.name ?? "",
              description: input.description,
              price: input.price ?? 0,
              quantity: input.quantity ?? 0,
              image: input.image,
            },
          });
          return data;
        } catch (e) {
          return { message: e.message ?? "unknown error" };
        }
      },
    });
  },
});

export const DeleteInventoryResult = unionType({
  name: "DeleteInventoryResult",
  resolveType: (value) => ("message" in value ? "Error" : "Inventory"),
  definition: (t) => t.members("Inventory", "Error"),
});

// Delete an inventory item
export const DeleteInventoryMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteInventory", {
      type: "DeleteInventoryResult",
      args: {
        id: nonNull("String"),
        comment: nonNull("String"),
      },
      async resolve(_parent, args, ctx) {
        const { id, comment } = args;
        try {
          // create transaction as we don't want to delete the inventory item
          // if the metadata is not created
          const [inventory] = await ctx.prisma.$transaction([
            // mark as deleted
            ctx.prisma.inventory.update({
              where: { id },
              data: {
                deletedAt: new Date(),
              },
            }),
            // create metadata about deletion
            ctx.prisma.inventoryMetadata.create({
              data: {
                inventoryId: id,
                comment,
                type: "deletion",
              },
            }),
          ]);
          return inventory;
        } catch (e) {
          if (e.meta.cause === "Record to update not found.") {
            return {
              message: "Inventory not found",
            };
          }

          return {
            message: e.message,
          };
        }
      },
    });
  },
});

export const UndeleteInventoryResult = unionType({
  name: "UndeleteInventoryResult",
  resolveType: (value) => ("message" in value ? "Error" : "Inventory"),
  definition: (t) => t.members("Inventory", "Error"),
});

export const UndeleteInventoryMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("undeleteInventory", {
      type: "UndeleteInventoryResult",
      args: {
        id: nonNull("String"),
        comment: nonNull("String"),
      },
      async resolve(_parent, args, ctx) {
        const { id, comment } = args;
        try {
          // create transaction as we don't want to undelete the inventory item
          // if the metadata is not created
          const [inventory] = await ctx.prisma.$transaction([
            // mark as deleted
            ctx.prisma.inventory.update({
              where: { id },
              data: {
                deletedAt: null,
              },
            }),
            // create metadata about deletion
            ctx.prisma.inventoryMetadata.create({
              data: {
                inventoryId: id,
                comment,
                type: "undeletion",
              },
            }),
          ]);
          return inventory;
        } catch (e) {
          return {
            message: e.message,
          };
        }
      },
    });
  },
});

import { objectType } from "nexus";

export const InventoryMetadata = objectType({
  name: "InventoryMetadata",
  definition(t) {
    t.nonNull.string("id", {
      description: "The unique identifier for the inventory metadata",
    });
    t.nonNull.date("createdAt", {
      description: "The date and time the inventory item was created",
    });
    t.nonNull.date("updatedAt", {
      description: "The date and time the inventory item was last updated",
    });
    t.nonNull.string("comment", {
      description: "A comment about the inventory item",
    });
    t.nonNull.string("type", {
      description: "The type of inventory item",
    });
    t.nonNull.string("inventoryId", {
      description: "The unique identifier for the inventory item",
    });
  },
});

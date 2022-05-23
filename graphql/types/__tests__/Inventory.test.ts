import { createServer } from "@graphql-yoga/node";
import request from "supertest";
import { Inventory } from "../Inventory";
import { schema } from "../..";
import { PrismaClient } from "@prisma/client";
import { createContext } from "../../context";

const yoga = createServer({
  schema,
  context: createContext,
});

const prisma = new PrismaClient();

describe("Inventory", () => {
  beforeEach(async () => {
    await prisma.inventoryMetadata.deleteMany();
    await prisma.inventory.deleteMany();
  });

  it("should be defined", () => {
    expect(Inventory).toBeDefined();
  });

  it("should return a list of inventories", async () => {
    const query = `
      query {
        inventory {
          id
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.inventory).toHaveLength(0);
  });

  it("should create a new inventory", async () => {
    const query = `
      mutation {
        createInventory(
          input: {
            name: "Test Name"
            description: "Test Description"
            image: "some url"
            price: 100
            quantity: 1
          }
        ) {
          ... on Inventory {
            id
            name
            description
            image
            price
            quantity
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.createInventory.description).toEqual(
      "Test Description"
    );
  });

  it("should return an error when creating an inventory with a negative quantity", async () => {
    const query = `
      mutation {
        createInventory(
          input: {
            name: "Test Name"
            description: "Test Description"
            image: "some url"
            price: 100
            quantity: -1
          }
        ) {
          ... on Inventory {
            id
            name
            description
            image
            price
            quantity
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.createInventory.message).toEqual(
      "Quantity must be greater than 0"
    );
  });

  it("should update an inventory", async () => {
    const inventory = await prisma.inventory.create({
      data: {
        name: "Test Name",
        description: "Test Description",
        image: "some url",
        price: 100,
        quantity: 1,
      },
    });

    const query = `
      mutation {
        updateInventory(
          input: {
            id: "${inventory.id}"
            name: "Updated Name"
            description: "Updated Description"
            image: "Updated Image"
            price: 200
            quantity: 2
          }
        ) {
          ... on Inventory {
            id
            name
            description
            image
            price
            quantity
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.updateInventory.description).toEqual(
      "Updated Description"
    );
  });

  it("should return an error when updating an inventory with a negative quantity", async () => {
    const inventory = await prisma.inventory.create({
      data: {
        name: "Test Name",
        description: "Test Description",
        image: "some url",
        price: 100,
        quantity: 1,
      },
    });

    const query = `
      mutation {
        updateInventory(
          input: {
            id: "${inventory.id}"
            name: "Updated Name"
            description: "Updated Description"
            image: "Updated Image"
            price: 200
            quantity: -1
          }
        ) {
          ... on Inventory {
            id
            name
            description
            image
            price
            quantity
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });
    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.updateInventory.message).toEqual(
      "Quantity must be greater than 0"
    );
  });

  it("should delete an inventory", async () => {
    const inventory = await prisma.inventory.create({
      data: {
        name: "Test Name",
        description: "Test Description",
        image: "some url",
        price: 100,
        quantity: 1,
      },
    });

    const query = `
      mutation {
        deleteInventory(
          id: "${inventory.id}"
          comment: "deletion comment"          
        ) {
          ... on Inventory {
            id
            description
            metadata {
              comment 
            }
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteInventory.metadata[0].comment).toEqual(
      "deletion comment"
    );
  });

  it("should return an error when deleting an inventory that does not exist", async () => {
    const query = `
      mutation {
        deleteInventory(
          id: "123"
          comment: "deletion comment"          
        ) {
          ... on Inventory {
            id
            name
            description
            image
            price
            quantity
            metadata {
              comment
            }
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteInventory.message).toEqual(
      "Inventory not found"
    );
  });

  it("should undelete an inventory", async () => {
    const inventory = await prisma.inventory.create({
      data: {
        name: "Test Name",
        description: "Test Description",
        image: "some url",
        price: 100,
        quantity: 1,
        deletedAt: new Date(),
      },
    });

    const query = `
      mutation {
        undeleteInventory(
          id: "${inventory.id}"
          comment: "undeletion comment"
        ) {
          ... on Inventory {
            id
            name
            description
            image
            price
            quantity
            metadata {
              comment
            }
          }
          ... on Error {
            message
          }
        }
      }
    `;

    const response = await request(yoga).post("/graphql").send({
      query,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.undeleteInventory.name).toEqual("Test Name");
    expect(response.body.data.undeleteInventory.metadata[0].comment).toEqual(
      "undeletion comment"
    );
  });
});

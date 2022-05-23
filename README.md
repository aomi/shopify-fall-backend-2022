# Shopify Backend Fall 2022 Challenge

This is my submission for the Shopify Developer Intern Challenge. I chose to implement a backend for a fictional inventory tracking web application.

Apart from the basic CRUD functionalities for inventory, this application implements soft-deletion with comments.

## Language

I used TypeScript running on Node.js for my backend. I feel using a statically-typed language is a great tool in catching trivial errors otherwise missed with untyped languages.

## Framework

I used [Next.js](https://nextjs.org/) to create the backend using API routes as the developer experience with Next.js is fast and efficient. I also wanted to leave the possobility of adding a frontend time permitting.

## API

I implemented a GraphQL endpoint which is attached to API routes in Next.js. I chose to use GraphQL as it creates a interface that both frontend and backend engineers can use in a way that works for them. I also like how a lot of the documentation is built from just the schema.
The GraphQL endpoint was implemented using [Nexus](https://nexusjs.org/), a type-safe way of defining GraphQL schemas.

## Database

For the data persistence, I used [Prisma](https://nexusjs.org/) with sqlite3. Having typings for the models used in the database made typing every smooth and easy. As the queries required in this application were not very complicated, I felt an object-relational-mapper would work well here.

## Testing

For testing, I used [Jest](https://jestjs.io/) as my testing framework. I implemented tests for the GraphQL queries and mutations while I developed my application.

# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The GraphQL endpoint and the GraphiQL playground can be found at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

If some seed data is desired, `npx prisma db seed` can be excuted and some _cool_ shirts and jeans will be added to the database.

# Future Work

For future work, I would implement the following features and fixes:

## Data Validation

While the GraphQL does some data validation, I would implement further data validation on mutations like character length and invalid language on product titles etc. I demonstrated some of this against the `quantity` property on the inventory objects.

## Testing

While there are test cases for mutations and queries, I would try to further make these tests more robust. The currently implemented tests are moreso integration tests as they all hit the database layer. I would like to abstract the database away in further development for a better development experience as well as making sure unit tests and integration tests exist where they are appropriate.

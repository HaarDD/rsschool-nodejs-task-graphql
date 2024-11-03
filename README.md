# Node.js Task GraphQL Basics

## Description

A Node.js application leveraging Fastify, GraphQL, Prisma, and DataLoader to build a scalable and efficient GraphQL API. The project implements robust querying and mutation functionalities with optimized data fetching to prevent the N+1 problem.

## Features

- **GraphQL API**: Comprehensive schema with queries and mutations.
- **Prisma ORM**: Database interactions with type safety.
- **DataLoader**: Efficient batching and caching to solve the N+1 problem.
- **Validation**: Depth limitation on GraphQL queries to enhance security.
- **Testing**: Integrated tests for queries, mutations, rules, and loaders.

## Getting Started

### Prerequisites

- **Node.js**: Version 22.0.0 or higher.
- **npm**: Node package manager.
- **Prisma CLI**: For database migrations and seeding.

### Installation

1. **Clone the Repository & checkout develop branch:**
   ```cmd
   git clone https://github.com/HaarDD/rsschool-nodejs-task-graphql.git
   ```
   Go to target directory
   ```
   git checkout origin develop
   ```
2. **Install Dependencies:**
   ```cmd
   npm ci
   ```
3. **Create .env file (based on .env.example) in root directory**
4. **Create database.db in ./prisma/database.db**
5. **Apply pending migrators:**
   ```cmd
   npx prisma migrate deploy
   ```
6. **Seed db**
   ```cmd
   npx prisma db seed
   ```
7. Start server or run all tests:
   ```cmd
   npm run start
   ```
   OR
   ```cmd
   npm run test-queries && npm run test-mutations && npm run test-rule && npm run test-loader && npm run test-loader-prime
   ```

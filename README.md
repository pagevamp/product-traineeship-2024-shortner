# Product-Traineeship-2024-URL-Shortner

A full-fledged URL Shortener application built with [NestJS](https://nestjs.com/) and
[PostgreSQL](https://www.postgresql.org/). This application allows users to shorten URLs and track analytics of it.

---

## Features

- **User Authentication and Authorization**
  - User Signups and Logins (JWT-based)
  - Email Verification for Account Activation
  - Secure endpoints
- **URL Management**
  - Create Shortened URLs from long URLs
  - Set Expiration Dates for URLs
  - Automatic Email Notification upon URL Expiration
  - Ownership-based Access Control (Users manage only their own URLs)
  - Limit requests per IP to 5 requests/second
- **Analytics**
  - Track Clicks, IP Addresses, and User Agents
  - Filter Analytics by Date Ranges
  - View Hit Counts per URL
- **Containerization**
  - Containerized with Docker and Docker Compose

---

## Technology Stack

- **Backend Framework:** [NestJS](https://nestjs.com/) with TypeScript
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [TypeORM](https://typeorm.io/)
- **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Getting Started

These instructions will help you set up the development environment on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) >= 18.x
- [Yarn](https://classic.yarnpkg.com/) or [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/pagevamp/product-traineeship-2024-shortner.git
   cd product-traineeship-2024-shortner
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

   _or_

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the project root using the provided `.env.example` as a reference:

   ```bash
   cp .env.example .env
   ```

### Running the Application

1.  **Start with Docker Compose**

    Running with Docker Compose will start both the application and the database in separate containers:

    ```bash
    docker-compose up --build
    ```

    This will:

    - Pull/Build a PostgreSQL database container.
    - Build and start the NestJS application container.

2.  **Start with Node**

    For running this application without Docker, you need to have Nodejs and Postgresql database installed and running
    in your machine. Once they are installed, you can follow the following command to run the project:

    ```bash
    yarn run start:dev
    ```

    _or_

    ```bash
    npm run start:dev
    ```

    This will:

    - Build and start the NestJS application.

**The application will be available at [http://localhost:3000](http://localhost:3000) or any other port specified in
.env file.**

**Accessing the API**

- **Postman Workspace:** Once running, you can test the APIs endpoints from this
  [Postman Workspace](https://app.getpostman.com/join-team?invite_code=ae15f99f77c9b3340b4b06967e53ea8d&target_code=ebe49affb0f7da6c722a1e304af95d2d).
  You might have to create a postman account before joining the workspace.

---

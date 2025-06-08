# Video Processing Microservices

This project implements the Rocketseat scalable microservices challenge, that consists in a microservices-based application for asynchronous video processing. The architecture is designed for scalability and observability, utilizing a message queue for communication between services, Infrastructure as Code for deployment, and an API Gateway for managing access.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Services](#services)
  - [Processor Service](#processor-service)
  - [Catalog Service](#catalog-service)
- [Observability](#observability)
- [Documentation](#documentation)

---

## Architecture Overview

The application consists of two core microservices: **Processor** and **Catalog**. They communicate asynchronously via **RabbitMQ**. User requests are routed through **Kong**, which acts as an API Gateway.

The entire infrastructure is managed using **Pulumi** (Infrastructure as Code). For observability, distributed tracing is implemented with **Jaeger** and **OpenTelemetry**, providing insights into request flows across the services.

The general workflow is:

1.  A client sends a request to upload a video through the Kong API Gateway.
2.  The request is forwarded to the appropriate service.
3.  A message is published to a RabbitMQ queue, indicating a new video needs processing.
4.  The **Processor Service** consumes the message, processes the video, and publishes another message upon completion.
5.  The **Catalog Service** consumes the completion message and updates its database with the new video's metadata.

---

## Project Structure

The repository is organized as follows:

```
.
├── app-catalog/         # Catalog microservice (Express.js)
├── app-processor/       # Processor microservice (Express.js)
├── contracts/           # Shared message schemas and types
├── docker/kong          # Kong configuration
├── docs/                # Project documentation
│   └── challenge.md     # Original task description
├── infra/               # Infrastructure as Code (IaC) scripts
└── docker-compose.yml   # Docker configuration for local development
```

---

## Key Technologies

- **Microservices:** Node.js, Express.js
- **Message Queue:** RabbitMQ (using `amqplib`)
- **API Gateway:** Kong
- **Observability:** Jaeger with OpenTelemetry
- **Infrastructure as Code (IaC):** Pulumi
- **Containerization:** Docker

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v18.x or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)

### Installation

1.  **Install dependencies for each service:**

    ```bash
    # For the processor service
    cd app-processor
    npm install
    cd ..

    # For the catalog service
    cd app-catalog
    npm install
    cd ..
    ```

### Running the Application

1.  **Start Infrastructure with Docker Compose:**
    This command will start RabbitMQ, Jaeger, and other dependencies.

    ```bash
    docker-compose up -d
    ```

2.  **Deploy Infrastructure with Pulumi:**
    Navigate to the Pulumi directory and deploy the infrastructure (like Kong configuration).

    ```bash
    cd pulumi
    pulumi up
    ```

3.  **Start the Microservices:**
    Open two separate terminal windows to run each service.

    - **Terminal 1: Start Processor Service**

      ```bash
      cd app-processor
      npm run start
      ```

    - **Terminal 2: Start Catalog Service**
      ```bash
      cd app-catalog
      npm run start
      ```

The services will now be running and connected to the RabbitMQ instance. Requests can be made through the Kong API Gateway.

---

## Services

### Processor Service

- **Location:** `/app-processor`
- **Responsibilities:**
  - Process videos posted by the user
  - Publishes a `content-created` event to a topic exchange on RabbitMQ upon start video processment.

### Catalog Service

- **Location:** `/app-catalog`
- **Responsibilities:**
  - Provides an API for querying videos catalog.
  - Consumes `content-created` messages to add or update video information in its database.

---

## Contracts

- **Location:** `/contracts`
- **Purpose:** This directory contains the schemas and type definitions for messages passed between services via RabbitMQ. This ensures consistency and prevents data mismatches between the producer and consumer.

---

## Observability

Distributed tracing is configured using OpenTelemetry and visualized with Jaeger.

- **Jaeger UI:** `http://localhost:16686`

Once the services are running and handling requests, you can visit the Jaeger UI to inspect traces and analyze the latency and flow of operations across the microservices.

---

## Documentation

- Further technical details and architectural decisions can be found in the `/docs` folder.
- The original challenge description that motivated this project is available at `/docs/challenge.md`.


Event Analytics Tracking System — High-Performance Ingestion & Reporting
A scalable, production-ready analytics pipeline built with Node.js, Redis, PostgreSQL, and Docker.
Designed to handle high-throughput event ingestion, asynchronous processing, and fast reporting queries.

This system demonstrates real-world architecture used in modern analytics & logging platforms.

Key Features
🔹 High-Speed Event Ingestion
Lightweight Node.js API

Validates events and pushes to Redis queue

Returns instantly ({ status: "ok" }) for maximum throughput

🔹 Asynchronous Worker Processor
Dedicated Node.js worker service

Pulls events from Redis and writes to PostgreSQL

Enables reliability, fault isolation, and scalable processing

🔹 Powerful Reporting API
Daily stats per site_id

Total views

Unique users

Top visited paths

Backed by indexed PostgreSQL queries

Fully Dockerized
One command to run all services

Includes Redis, Postgres, Ingest API, Worker, Reporting API

bash
Copy code
docker compose up --build
Tech Stack
Node.js (Express) – ingestion, background worker, reporting

Redis – ultra-fast queue

PostgreSQL – reliable analytics storage

Docker Compose – orchestration and local development

🎯 Built For
Interview-ready demonstration

Scalable backend design

Real-world event pipeline structure

Analytics/Telemetry/Lifecycle event logging

🔧 Use Cases
Page view and click tracking

User activity logs

API usage metrics

Real-time dashboard ingestion

Background processing pipelines

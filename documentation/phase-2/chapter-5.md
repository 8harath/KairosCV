# Chapter 5: System Architecture

## 5.1 Introduction

This chapter documents the architecture of KairosCV and explains how the system is organized internally to support resume optimization. In developing this project, we aimed to build a system that was not only functional from the user’s perspective but also well-structured from an engineering perspective. Since the application combines file handling, AI-assisted processing, authentication, storage, and PDF generation, a clear architectural design was necessary to ensure maintainability and reliability.

The architecture of KairosCV reflects our effort to divide responsibilities across meaningful layers and modules. Instead of treating the application as a single continuous block of logic, we organized the project into distinct structural areas that work together to transform an uploaded resume into an optimized downloadable document.

## 5.2 Architectural Overview

At a high level, KairosCV follows a modular full-stack web application architecture. The major architectural layers of the system can be understood as follows:

1. Presentation layer.
2. Routing and request handling layer.
3. Processing and business logic layer.
4. AI and extraction support layer.
5. Storage and persistence layer.
6. Output generation layer.

These layers collectively support the complete workflow of the platform. The presentation layer enables user interaction, the routing layer manages communication between the client and backend, the processing layer handles core resume transformation logic, the storage layer manages file and metadata persistence, and the output layer generates the final resume document.

*Placeholder: Insert a high-level architecture diagram showing frontend, server routes, processing modules, AI services, storage, and PDF generation.*

## 5.3 Architectural Style

The architectural style of KairosCV can be described as modular and service-oriented within a unified codebase. Although the application is built inside a single repository, different technical responsibilities are separated into focused modules. This design was useful because it allowed us to maintain conceptual clarity while still benefiting from an integrated full-stack framework.

We deliberately avoided placing all logic inside route handlers or frontend pages. Instead, important concerns such as parsing, validation, AI extraction, enhancement, storage handling, and PDF generation were placed into reusable backend modules. This supports a more disciplined engineering structure and makes the system easier to test, analyze, and extend.

The benefits of this style include:

1. Cleaner separation of concerns.
2. Improved code maintainability.
3. Easier debugging of individual subsystems.
4. Better support for future feature expansion.
5. Stronger alignment with professional software design principles.

## 5.4 Frontend Architecture

The frontend of KairosCV is organized as a component-driven user interface. This approach allows the application to be built from smaller reusable units instead of large monolithic screens.

The main frontend areas include:

1. Login and authentication-related pages.
2. Dashboard interface.
3. Optimize page.
4. Settings page.
5. Layout, navigation, and shared UI components.

Within the optimize workflow, the user interacts with components such as the file uploader, progress tracker, results panel, and template selector. These components are coordinated to create a guided resume optimization experience.

The frontend also relies on stateful hooks for handling dynamic behavior such as upload state, processing progress, result availability, and user notifications. This allows the user interface to remain responsive while the backend performs more intensive processing.

### 5.4.1 Responsibilities of the Frontend

The frontend is responsible for:

1. Accepting file and user input.
2. Performing basic client-side checks before upload.
3. Sending input data to backend routes.
4. Displaying progress updates during processing.
5. Presenting final results and download options.
6. Providing access to dashboard and settings workflows.

This means that the frontend acts primarily as an interaction layer and coordination surface. Heavy processing remains on the server side.

*Placeholder: Insert a screenshot of the optimize page with annotations for the main frontend components.*

## 5.5 Backend Architecture

The backend of KairosCV is implemented through server-side routes and supporting modules within the same Next.js application. This allowed us to build a tightly integrated full-stack solution while still keeping processing logic separate from UI logic.

The backend is responsible for:

1. Receiving uploaded files.
2. Validating input securely.
3. Managing file and metadata storage.
4. Running the resume processing pipeline.
5. Streaming progress updates to the frontend.
6. Generating the final PDF.
7. Handling download delivery.
8. Supporting authenticated and user-specific operations.

A major design decision in the backend was separating route definitions from internal logic. The route handlers focus on request-response orchestration, while the actual business logic lives inside library modules. This makes the system cleaner and easier to document.

### 5.5.1 Route-Level Structure

The backend uses specialized routes for different responsibilities. These include:

1. Upload handling.
2. Streaming processing updates.
3. Downloading generated output.
4. Accessing stored resume or JSON data.
5. Managing user profile operations.
6. Supporting health checks and system diagnostics.

This route-based organization helps make the backend behavior more explicit and easier to evaluate.

## 5.6 Processing Architecture

The central architectural feature of KairosCV is the resume processing pipeline. This part of the system transforms a raw user-uploaded document into structured, enhanced, validated, and formatted resume data.

The processing architecture is organized as a staged pipeline consisting of:

1. File resolution and preparation.
2. Text extraction.
3. Structured data extraction.
4. AI-assisted enhancement.
5. Cleanup and validation.
6. Quality scoring.
7. Template mapping.
8. PDF generation and storage.

We adopted a pipeline structure because resume optimization is inherently a multi-step transformation problem. A sequential and modular architecture made it possible to manage each stage independently while still maintaining a coherent end-to-end workflow.

*Placeholder: Insert a processing architecture diagram showing the full backend pipeline from uploaded file to final PDF.*

## 5.7 AI and Extraction Support Architecture

KairosCV includes a dedicated support layer for resume extraction, field interpretation, and AI-driven enhancement. This layer helps the processing pipeline deal with real-world resume complexity rather than assuming perfect input formatting.

The support architecture includes:

1. File-type-specific parsing modules.
2. AI extraction and enhancement services.
3. Field classification helpers.
4. Verification and completeness-checking logic.
5. Confidence and scoring utilities.

The purpose of this layer is to increase robustness. In practice, resumes differ widely in structure and formatting. By using support modules around the main pipeline, the system is better able to handle irregular cases without relying on a single fragile extraction strategy.

## 5.8 Storage Architecture

The storage architecture of KairosCV was designed to support both development convenience and deployment flexibility. For this reason, the project supports two primary storage modes:

1. Local file storage.
2. Supabase-backed storage.

Local storage is useful for development and testing because it reduces setup complexity. Supabase-backed storage is useful for cloud-oriented deployment and account-linked persistence.

### 5.8.1 Metadata Storage

In addition to uploaded and generated files, the system also stores metadata. This includes details such as:

1. File identifiers.
2. Original filenames.
3. Upload timestamps.
4. User associations.
5. Template selections.
6. Processing status information.
7. Output storage references.

Metadata is essential because the system must track not only the file content but also the context required to process, retrieve, and display the result correctly.

## 5.9 Authentication and Access Structure

Authentication is built into the system architecture rather than handled as an isolated feature. Protected pages and user-linked resume history depend on consistent session handling and route enforcement.

This part of the architecture supports:

1. User login and session awareness.
2. Protected route access.
3. User-specific dashboard content.
4. Resume ownership tracking.
5. Account-based profile retrieval.

This integration ensures that user identity influences both application behavior and data access patterns.

## 5.10 Output Generation Architecture

The final architectural layer is responsible for turning processed resume data into the final downloadable document. This includes:

1. Template selection.
2. Template rendering.
3. PDF generation.
4. Output storage.
5. Download delivery.

One of our key architectural decisions was to separate content processing from presentation rendering. This allows the same processed resume data to be displayed through different templates without changing the underlying extraction and enhancement logic.

This design also makes future template expansion more manageable.

## 5.11 Data Flow Through the System

The movement of data through KairosCV can be described in the following sequence:

1. The user submits a resume and optional supporting input.
2. The backend validates and stores the upload.
3. The processing layer extracts raw text from the file.
4. The extraction layer converts the content into structured data.
5. The AI layer enhances and verifies the extracted result.
6. The validation layer normalizes and checks the processed data.
7. The output layer renders the final PDF.
8. The storage layer preserves output references and metadata.
9. The frontend receives progress updates and final download availability.

This flow shows that the architecture is data-centric. Each major layer either transforms, validates, stores, or presents data as part of the overall resume optimization process.

*Placeholder: Insert a data flow diagram showing how information moves across the system from user upload to final download.*

## 5.12 Major Design Decisions

Several design decisions strongly influenced the architecture of KairosCV:

1. We used a unified full-stack framework for tighter integration.
2. We separated route handling from business logic.
3. We implemented processing as a staged pipeline.
4. We supported both local and cloud-backed storage.
5. We embedded authentication into the application structure.
6. We separated structured data preparation from presentation rendering.

These choices helped us keep the project realistic in scope while still demonstrating architectural depth and engineering discipline.

## 5.13 Chapter Summary

In this chapter, we documented the architecture of KairosCV by explaining its layered structure, frontend and backend organization, processing design, AI support layer, storage architecture, authentication structure, and data flow. This architectural foundation is essential for understanding how the system is able to coordinate multiple technical concerns within a single resume optimization platform.

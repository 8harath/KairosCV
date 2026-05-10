# Phase 2: Architecture and Core Working

## Contents

1. Architecture
   - Overall architecture diagram
   - Frontend architecture
   - Backend architecture
   - External services and integrations
   - Data flow overview

2. Detailed Working of the Resume Optimization Pipeline
   - File upload and validation
   - Supported formats: PDF, DOCX, TXT
   - Raw text extraction
   - Multi-layer structured data extraction
   - AI verification and completeness checking
   - Resume enhancement and job-description tailoring
   - Data cleanup and normalization
   - Resume scoring/confidence evaluation
   - Template mapping
   - PDF generation and final output

3. Real-Time Processing and Feedback
   - Server-Sent Events progress streaming
   - Processing stages shown to the user
   - Error handling during processing
   - Final completion and download signaling
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
# Chapter 6: Detailed Working of the Resume Optimization Pipeline

## 6.1 Introduction

The resume optimization pipeline is the operational core of KairosCV. It is the part of the system that converts an uploaded resume into a refined, validated, and professionally formatted output. In designing this pipeline, we focused on building a workflow that was structured, transparent, and capable of handling the irregularities commonly found in real resume documents.

Rather than relying on a single processing step, we implemented the pipeline as a sequence of controlled stages. Each stage performs a distinct task and prepares the output for the next stage. This staged design improves both reliability and clarity, which is especially important in a capstone project intended for evaluation.

## 6.2 Input Collection Stage

The pipeline begins when the user submits information through the optimize interface. At this stage, the system captures:

1. The uploaded resume file.
2. An optional job description.
3. The selected resume template.
4. The selected output paper format.

Although the resume file is the main input, the surrounding context also matters. For example, the job description may influence enhancement decisions, and the selected template affects the final rendering stage.

*Placeholder: Insert a screenshot of the optimize page highlighting all inputs captured before processing begins.*

## 6.3 File Validation Stage

Once the input is submitted, the backend validates the uploaded file before any deeper processing begins. This validation step is necessary to ensure that unsupported or suspicious files do not enter the pipeline.

The system checks:

1. Whether a file is present.
2. Whether the extension is supported.
3. Whether the MIME type is allowed.
4. Whether the file size is within the defined limit.
5. Whether the file signature matches the expected file type.

We included signature-level validation because filename checks alone are not sufficient. This helps improve the reliability and safety of the processing flow.

## 6.4 Storage and Metadata Registration Stage

After successful validation, the system generates a secure file identifier and stores the uploaded file using the configured storage mode. At the same time, metadata related to the upload is recorded.

This metadata may include:

1. File identifier.
2. Original file name.
3. File size and type.
4. User association.
5. Job description if provided.
6. Selected template.
7. Selected paper format.
8. Storage location reference.

This stage is important because the pipeline depends not only on raw file content but also on contextual information that influences later processing and retrieval.

## 6.5 File Resolution Stage

Before extraction begins, the system resolves the uploaded file from storage into a form that can be processed consistently. This stage allows the rest of the workflow to operate without needing to know whether the file came from local storage or a cloud-backed storage path.

This normalization step contributes to modularity because it decouples downstream processing from storage-specific details.

## 6.6 Raw Text Extraction Stage

The next stage is raw text extraction, which is one of the most critical parts of the pipeline. Since all later stages depend on the extracted content, this stage directly influences overall output quality.

KairosCV handles supported file types differently.

### PDF Resume Extraction

PDF extraction uses an enhanced strategy because PDFs often contain formatting complexity such as columns, spacing irregularities, and layout-driven reading order issues. The system therefore uses extraction logic designed to improve text recovery quality in such cases.

### DOCX Resume Extraction

DOCX files are processed using a format-specific strategy that can preserve useful structure more effectively than plain text conversion.

### TXT Resume Extraction

TXT files are read directly, making them the simplest format handled in the pipeline.

At the end of this stage, the system has obtained the raw text representation of the resume, along with extraction-related context where available.

*Placeholder: Insert a pipeline diagram showing PDF, DOCX, and TXT extraction paths converging into a common raw-text output.*

## 6.7 Extraction Status Communication Stage

After text extraction, the system updates the current processing status so that the user can be informed that the uploaded document has been successfully read and interpreted at a base level.

This stage may communicate:

1. That extraction is complete.
2. Which strategy was used.
3. Whether verification support was involved.
4. Whether extraction confidence indicators are available.

This supports transparency and helps the user understand that the system is progressing through meaningful backend stages.

## 6.8 Structured Resume Data Extraction Stage

Once raw text is available, the system attempts to convert that text into a structured resume representation. This is one of the most important transformations in the entire application.

The extraction logic tries to identify and organize:

1. Contact information.
2. Summary or profile content.
3. Education history.
4. Work experience.
5. Skills.
6. Projects.
7. Certifications.
8. Additional optional sections such as awards, publications, languages, volunteer work, hobbies, or custom sections.

This stage is essential because the final resume cannot be generated reliably from raw text alone. The system first needs a formal internal data structure that represents the resume in a consistent way.

## 6.9 Verification and Completeness Analysis Stage

An important strength of our implementation is that the first extraction result is not blindly treated as final. The system includes a verification stage that compares the extracted structure against the available raw text to identify possible omissions or weak extraction quality.

This stage helps detect:

1. Missing content.
2. Incomplete sections.
3. Low-confidence extraction results.
4. Situations where another extraction pass or merge strategy may be useful.

This was an important design choice because resume quality depends not only on improving what was extracted, but also on ensuring that important information was not lost during the extraction process itself.

## 6.10 Job-Description-Aware Processing Stage

If the user provides a job description, the system carries that context into the enhancement phase. This allows resume improvement to be more targeted toward the intended role.

This stage is useful because different job roles often emphasize different technologies, responsibilities, or communication styles. A context-aware system can produce a more useful output than one that applies the exact same wording strategy to every resume.

## 6.11 AI Enhancement Stage

After structured extraction, the system moves into AI-based enhancement. This stage focuses on improving the professional quality of the content while preserving the user’s original meaning and background.

Typical enhancement activities include:

1. Strengthening bullet points.
2. Improving phrasing and clarity.
3. Generating or refining summary text.
4. Organizing skills more effectively.

We approached this stage carefully because the goal is optimization, not content invention. The system is intended to improve presentation and wording rather than fabricate achievements or alter the underlying profile of the user.

*Placeholder: Insert a conceptual before-and-after screenshot or text placeholder showing how a resume bullet can be improved in style without changing meaning.*

## 6.12 Cleanup and Normalization Stage

Once enhancement is complete, the system performs cleanup and normalization. This is necessary because extracted and AI-modified data may still contain inconsistencies or formatting issues that could affect final rendering quality.

Typical cleanup operations include:

1. Removing duplicate entries.
2. Cleaning bullet structures.
3. Normalizing date and section formats.
4. Correcting minor inconsistencies.
5. Preparing the data for strict validation.

This stage acts as a stabilizing layer between enhancement and formal validation.

## 6.13 Validation Stage

After cleanup, the system validates the processed resume data against the expected schema. This helps ensure that the resulting object is complete enough and structured correctly for rendering into the final template.

If structural issues remain, the system can apply fallback behavior such as filling required defaults where appropriate. This improves resilience and reduces the likelihood of rendering failures.

Validation is therefore a major checkpoint in the pipeline. It separates intermediate processing from output-ready data.

## 6.14 Confidence Scoring Stage

The system also evaluates the processed resume by generating a quality or confidence score. This score reflects the apparent completeness and reliability of the structured result.

From a design perspective, this stage is useful because it:

1. Summarizes the state of the processed resume.
2. Helps support internal debugging.
3. Can improve progress reporting and future feedback.
4. Reflects an additional layer of self-assessment inside the pipeline.

Including this stage demonstrates that the system is not only transforming data but also attempting to measure the quality of that transformation.

## 6.15 Final Data Preparation Stage

Before rendering begins, the system performs final data preparation. This may include inferring missing skill information from project content where appropriate and ensuring that the structured resume object is ready for template rendering.

At this point, the resume exists as a validated internal representation that is suitable for final presentation generation.

## 6.16 Template Mapping Stage

The next stage maps the structured resume data into the selected template. This is where content and presentation begin to converge.

Template mapping ensures that:

1. Contact information appears in the intended heading area.
2. Experience and education are placed in the correct layout sections.
3. Optional content is rendered only when present.
4. The selected visual style is applied consistently.

This stage is necessary because structured data alone is not sufficient for presentation. It must be translated into a visual layout model.

## 6.17 PDF Generation Stage

After template mapping, the system generates the final PDF on the server side. This stage converts the rendered resume layout into the actual file that the user will receive.

Server-side generation was important in our implementation because it provides stronger control over layout consistency, page fitting, and final output quality.

*Placeholder: Insert a screenshot or conceptual diagram showing structured content being transformed into a finalized PDF output.*

## 6.18 Output Storage and Finalization Stage

Once the PDF is generated, the system stores the output and updates its metadata references. This allows the final result to be downloaded immediately and, for authenticated users, accessed later through dashboard history.

This stage ensures that the generated output is treated as a persistent artifact rather than a temporary response only.

## 6.19 Completion Stage

The final stage of the pipeline is the completion event. At this point, the system marks processing as finished and provides the frontend with access to the final output route.

For the user, this is the moment when the full backend workflow becomes visible as a usable result.

## 6.20 Significance of the Pipeline Design

The staged design of the pipeline is one of the strongest technical aspects of KairosCV. We believe it strengthens the project because it:

1. Improves modularity.
2. Supports clearer debugging and evaluation.
3. Allows controlled fallback behavior.
4. Makes progress tracking meaningful.
5. Improves system maintainability.

A simpler implementation might have produced an output more quickly from a development standpoint, but it would have been more difficult to understand, validate, and extend.

## 6.21 Chapter Summary

This chapter documented the detailed working of the KairosCV processing pipeline, covering each stage from user input and validation to extraction, enhancement, cleanup, validation, scoring, template mapping, PDF generation, and completion. This pipeline is the operational backbone of the project and represents the core engineering workflow through which the system produces its final optimized resume output.
# Chapter 7: Real-Time Processing and Feedback

## 7.1 Introduction

An important design consideration in KairosCV was ensuring that users remain informed while resume optimization is taking place. Since the backend workflow involves multiple stages and may require noticeable processing time, it was not sufficient to rely on a generic loading indicator. We therefore designed the application to provide real-time progress feedback during processing.

This chapter documents how that feedback mechanism works and why it contributes significantly to the usability and technical completeness of the system.

## 7.2 Need for Real-Time Feedback

The internal workflow of KairosCV includes several non-trivial stages such as file validation, text extraction, structured data processing, AI-assisted enhancement, cleanup, validation, scoring, and PDF generation. These operations may take time depending on file complexity and service responsiveness.

Without real-time feedback, the user might:

1. Assume that the application has become unresponsive.
2. Be uncertain whether the upload succeeded.
3. Have no visibility into the state of processing.
4. Be unable to distinguish between normal waiting and failure conditions.

For these reasons, we considered live feedback to be a necessary part of the application rather than an optional improvement.

## 7.3 Communication Mechanism

To support live progress reporting, the system establishes a streaming connection between the frontend and backend after the upload completes successfully. The uploaded file identifier is then used to connect the user interface to the corresponding processing workflow.

As the backend pipeline progresses through its stages, progress events are sent to the frontend. The frontend interprets these events and updates the visible progress tracker accordingly.

This mechanism allows the system to communicate meaningful state changes without forcing the user to refresh the interface or manually retry actions.

*Placeholder: Insert a communication flow diagram showing upload success, stream connection, backend event emission, and frontend progress updates.*

## 7.4 Event Lifecycle

The real-time feedback lifecycle can be described in the following sequence:

1. The user uploads a resume successfully.
2. The backend returns a file identifier.
3. The frontend begins listening for processing updates.
4. The backend starts the optimization pipeline.
5. Progress events are emitted during major stages.
6. The frontend updates the progress interface.
7. A final completion or error event closes the workflow.

This event lifecycle mirrors the structure of the backend pipeline and helps synchronize user awareness with actual processing progress.

## 7.5 Types of Feedback Provided

The system provides several kinds of feedback during processing. This was important because a single loading indicator would not adequately represent the complexity of the workflow.

### Stage-Level Status

The system indicates which major stage is currently being executed, such as parsing, extraction, enhancement, validation, scoring, generating, or finalizing.

### Progress Percentage

An approximate progress percentage is shown to help the user understand how far the process has advanced. While this does not guarantee an exact remaining time, it provides a useful sense of movement.

### Descriptive Status Message

The interface also presents short explanatory messages indicating what the system is doing at that moment. This improves clarity and reduces uncertainty for the user.

### Completion and Output Availability

When processing finishes successfully, the user is informed that the optimized resume is ready and can be downloaded.

### Error Notification

If a failure occurs during processing, the system can communicate an error state rather than leaving the user without explanation.

## 7.6 Relationship Between Backend Progress and User Interface

One of the strengths of the progress system is that the visible feedback is connected to actual backend work. The progress messages shown to the user are based on meaningful processing stages rather than being artificially simulated.

This design has several advantages:

1. It makes the interface more trustworthy.
2. It provides a more honest representation of the system’s work.
3. It reinforces the staged nature of the pipeline.
4. It improves the user’s understanding of the optimization process.

This is worth emphasizing because it demonstrates that the progress interface was designed as part of the real system behavior.

## 7.7 Progress Tracking Interface

On the frontend, the user sees a progress-tracking component that receives event data and turns it into a readable processing display. This interface plays an important role in connecting internal system activity to the external user experience.

The progress interface helps the user understand:

1. Whether the process has started.
2. Which stage is currently active.
3. How far the operation has progressed.
4. Whether the process completed successfully or failed.

This makes the interface significantly more informative than a simple spinner or indefinite loading message.

*Placeholder: Insert a screenshot of the progress tracker while the system is in the middle of processing a resume.*

## 7.8 Real-Time Feedback and User Trust

During implementation, we recognized that real-time feedback contributes directly to user trust. AI-assisted systems can sometimes appear opaque to users, especially when they perform several internal transformations before producing visible output.

By exposing meaningful stage information, the application communicates that:

1. The system has accepted the file.
2. The backend is actively processing the content.
3. The workflow is moving through identifiable steps.
4. The final output is being generated in a controlled manner.

This is especially valuable in a project like KairosCV, where users depend on the system to transform important professional documents.

## 7.9 Completion Signaling

The real-time feedback mechanism concludes with a completion event once the final PDF has been generated and prepared for retrieval. This event informs the frontend that the user can now move from waiting to result access.

The interface can then transition from progress tracking to result presentation and download support. This creates a clear end to the processing lifecycle and ensures that the user understands when the system has successfully finished.

## 7.10 Error Handling During Streaming

In addition to successful progress updates, the system also accounts for failure scenarios. If an error occurs during any major stage, the backend can emit an error event and terminate the processing stream in a controlled way.

This improves robustness because the user is not left in an indefinite loading state. Instead, the interface can:

1. Stop active progress tracking.
2. Display that processing failed.
3. Surface a usable error message.
4. Allow the user to retry if appropriate.

Handling failure visibly is an important part of building a credible and evaluable application.

## 7.11 Transparency as a System Principle

The progress and feedback architecture reflects a broader principle that influenced our system design: transparency. We wanted the internal work of the application to be visible enough for the user to remain informed, but not so technical that the interface becomes confusing.

This balance was important because the system performs sophisticated operations behind the scenes, yet the user experience must remain simple and manageable.

## 7.12 Evaluation Perspective

From the perspective of academic evaluation, the real-time feedback subsystem strengthens the project in multiple ways:

1. It demonstrates coordination between frontend and backend.
2. It shows thoughtful attention to usability.
3. It reinforces the real staged nature of the backend pipeline.
4. It improves practical reliability from the user’s viewpoint.
5. It reflects a more production-ready approach to application design.

For these reasons, real-time processing feedback should be seen as an integral part of the project rather than a secondary UI feature.

## 7.13 Chapter Summary

This chapter documented how KairosCV provides real-time processing feedback during resume optimization. We explained the need for live updates, the communication mechanism used between the frontend and backend, the event lifecycle, the types of feedback presented to the user, and the handling of both completion and failure states. This subsystem contributes significantly to the transparency, usability, and completeness of the overall application.

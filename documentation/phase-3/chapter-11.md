# Chapter 11: Storage and Persistence

## 11.1 Introduction

In addition to extraction, enhancement, and rendering, KairosCV also requires a reliable storage and persistence model. Uploaded resumes, processing metadata, generated outputs, and account-linked records must be managed in a way that supports both local development and realistic application use. In this chapter, we document how storage is handled in the system and why persistence is important to the overall design.

Storage in KairosCV is not limited to saving files temporarily. It also supports process tracking, output retrieval, user-linked history, and operational flexibility across environments.

## 11.2 Purpose of Storage in KairosCV

The storage layer serves several essential functions:

1. Preserving uploaded input files for processing.
2. Storing metadata needed for pipeline orchestration.
3. Retaining generated PDF outputs.
4. Supporting user-specific resume history.
5. Allowing intermediate or debug-oriented artifacts to be preserved where needed.

Without a structured storage approach, the system would not be able to support retrieval, persistence, or history-based workflows reliably.

## 11.3 Dual Storage Approach

One of the practical design choices in KairosCV was supporting both local file storage and Supabase-backed storage. This approach made the project easier to develop while also keeping it deployment-ready.

The two primary storage modes are:

1. Local storage mode.
2. Cloud-backed storage mode through Supabase.

This dual model provides flexibility because the same application can be tested locally with minimal infrastructure and later deployed with stronger persistence support.

## 11.4 Local File Storage Flow

Local storage is useful during development and testing. In this mode, uploaded resumes and generated artifacts can be stored directly through the filesystem. This allows the project to function even when a complete cloud environment is not required.

The local storage flow generally involves:

1. Accepting the uploaded file.
2. Saving it to a managed location.
3. Retrieving it later for parsing and processing.
4. Writing the generated PDF output to a corresponding location.
5. Serving the output back during download.

This mode is especially valuable during implementation because it reduces external dependencies while preserving the full logic of the processing pipeline.

## 11.5 Supabase-Backed Storage Flow

For more production-oriented use, KairosCV supports Supabase-backed storage and persistence. In this mode, uploaded input files and generated outputs can be stored through cloud-backed storage helpers rather than relying entirely on local files.

This mode is beneficial because it supports:

1. Better persistence across sessions.
2. Easier user-linked file management.
3. Stronger alignment with hosted deployment.
4. Separation between application runtime and stored artifacts.

The presence of this mode makes the system more realistic as a deployable application rather than only a local prototype.

## 11.6 Metadata Storage

In KairosCV, file storage alone is not sufficient. The system also maintains metadata associated with each upload and generated output. Metadata is essential because it allows the system to understand the context of each file and connect it to the rest of the workflow.

Stored metadata may include:

1. Unique file identifiers.
2. Original file names.
3. Upload timestamps.
4. User identifiers.
5. File types and sizes.
6. Job descriptions when provided.
7. Template selections.
8. Output storage locations.
9. Processing status information.

Metadata enables the application to recover the state and meaning of stored artifacts without depending solely on file paths.

## 11.7 Generated PDF Storage

Once resume optimization is complete, the generated PDF must be stored in a way that allows reliable download and, where applicable, later retrieval through the dashboard.

This is an important part of the persistence model because the generated PDF is the main deliverable of the application. Treating it as a first-class stored artifact ensures that:

1. Users can download their result.
2. Authenticated users can revisit prior outputs.
3. The system can associate the generated file with related metadata.

From an evaluation standpoint, this demonstrates that the application supports a complete output lifecycle rather than only a transient processing event.

## 11.8 JSON and Debug Artifact Storage

In addition to the final PDF, the system may also preserve structured JSON artifacts derived from the resume processing pipeline. These artifacts can be useful for inspection, debugging, and understanding the internal state of the extracted resume data.

This is valuable because:

1. It supports transparency during development.
2. It allows intermediate results to be inspected independently of the PDF.
3. It helps debug extraction or validation issues.
4. It provides an audit-oriented representation of the structured resume content.

Preserving such artifacts reflects an engineering mindset focused on observability and maintainability.

*Placeholder: Insert a diagram showing the relationship between uploaded file storage, metadata storage, structured JSON storage, and generated PDF storage.*

## 11.9 Resume History and Persistent User Records

For authenticated users, persistence is not limited to raw files. The application also maintains references that allow previously generated resumes to appear in the dashboard.

This aspect of persistence supports:

1. Resume history listing.
2. User-specific output ownership.
3. Easier retrieval of previous work.
4. A more complete account-based user experience.

This is significant because it transforms the application from a temporary processing tool into a reusable personal workspace.

## 11.10 Cleanup and Retention Behavior

Storage design also includes decisions about cleanup. Since uploaded files and generated outputs can accumulate over time, the system includes mechanisms intended to prevent unnecessary persistence of stale artifacts in certain contexts.

Cleanup and retention behavior is important because it affects:

1. Resource usage.
2. Privacy handling.
3. Operational hygiene.
4. Long-term maintainability.

By including cleanup-related support, the system demonstrates awareness that storage is not only about preservation but also about responsible lifecycle management.

## 11.11 Privacy and Persistence Considerations

Because KairosCV processes personal career documents, storage decisions also have privacy implications. Resumes contain sensitive data such as names, contact details, education records, and work history. For this reason, persistence must be considered carefully.

The storage design therefore benefits from:

1. Controlled file handling.
2. User-linked access paths.
3. Cleanup support where appropriate.
4. Separation between temporary processing and longer-term stored outputs.

This perspective is important in a professional evaluation context because it demonstrates that storage was treated as a responsible system concern rather than a purely technical convenience.

## 11.12 Importance of Persistence in the Overall Design

Persistence in KairosCV is closely tied to the application’s identity as a usable platform. Without storage and metadata management, the system could still process a file, but it would lose important functionality such as dashboard history, output reuse, and clearer operational tracking.

The persistence model therefore strengthens the application by:

1. Supporting full workflow continuity.
2. Improving deployment readiness.
3. Enabling account-based features.
4. Making the system easier to debug and evaluate.

## 11.13 Chapter Summary

This chapter documented the storage and persistence model of KairosCV, including local and Supabase-backed storage flows, metadata handling, generated PDF storage, structured JSON artifact storage, user-linked resume history, and cleanup considerations. Together, these elements ensure that the application is capable of preserving, retrieving, and managing its key artifacts in a reliable and deployment-conscious manner.

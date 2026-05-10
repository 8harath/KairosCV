# Phase 4: Platform Features and Operational Design

## Contents

1. Authentication and Access Control
   - Supabase authentication
   - Protected routes
   - Auth bypass mode for development
   - Session handling
   - User-specific resume history

2. API Design
   - `POST /api/upload`
   - `GET /api/stream/[fileId]`
   - `GET /api/download/[fileId]`
   - `GET /api/json/[fileId]`
   - `GET/DELETE /api/resume/[id]`
   - `GET/PATCH /api/profile`
   - Health and mock routes
   - Request/response patterns

3. Frontend Design and Components
   - App Router page structure
   - Key UI components
   - Upload interface
   - Progress tracker
   - Results panel
   - Template selector
   - Settings and dashboard UI

4. Trial Limiting and Usage Control
   - Free trial logic
   - Rolling 24-hour window
   - Guest vs authenticated handling
   - Supabase-backed trial tracking
# Chapter 12: Authentication and Access Control

## 12.1 Introduction

Authentication and access control are important parts of KairosCV because the application is not limited to anonymous file processing. It also supports user-linked resume history, protected platform areas, and profile-based workflows. In this chapter, we document how authentication is handled in the system and how access control supports both security and usability.

While designing the project, we wanted the application to function as a reusable workspace rather than only a temporary conversion utility. For that reason, identity management and controlled access were integrated into the platform structure.

## 12.2 Purpose of Authentication in KairosCV

Authentication in KairosCV serves several practical and architectural purposes:

1. It restricts access to protected parts of the application.
2. It links generated resumes to specific users.
3. It supports persistent dashboard history.
4. It enables profile-related settings and account-specific information.
5. It provides a more realistic platform design for deployment and evaluation.

Without authentication, the system could still process resumes, but it would lose important capabilities related to personalization, persistence, and controlled access.

## 12.3 Supabase as the Authentication Provider

KairosCV uses Supabase to support authentication and session-aware account behavior. This allowed us to avoid building a custom authentication system from the ground up while still supporting the login and account structure required by the project.

The use of Supabase supports:

1. User login and signup workflows.
2. Session management.
3. Access to user identity information.
4. Protected route enforcement in conjunction with middleware and server-side checks.
5. Integration with other account-linked records such as profiles and generated resumes.

This made Supabase a practical choice for the scope and goals of the project.

## 12.4 Protected Application Areas

Not all parts of the KairosCV interface are equally sensitive. Some pages represent general entry points, while others expose user-specific information or operational features that should be restricted.

Protected areas include:

1. The dashboard.
2. The optimize page.
3. The settings page.

These areas depend on user identity or provide access to personalized functionality. As a result, they are treated differently from public or semi-public entry points.

## 12.5 Access Control Flow

The access control behavior of the application can be described as a sequence of checks:

1. A user attempts to access a route.
2. The system determines whether the route is protected.
3. If authentication is enabled, the session is checked.
4. If the user is not authenticated, the system redirects to the login flow.
5. If the user is authenticated, access is granted.

This flow ensures that protected application areas remain account-aware and that unauthorized access is handled consistently.

*Placeholder: Insert an access control flow diagram showing user request, session check, protected route decision, redirect behavior, and successful access path.*

## 12.6 Middleware-Based Protection

One of the important structural choices in KairosCV is that access control is supported at the routing layer rather than handled only inside individual page logic. Middleware helps evaluate route access before the protected page is fully served.

This design offers several benefits:

1. It centralizes route protection behavior.
2. It reduces repeated authentication checks in unrelated places.
3. It makes access rules easier to reason about.
4. It provides a cleaner and more maintainable security structure.

Using middleware in this way reflects a more disciplined access-control design.

## 12.7 Session Handling

Authentication is meaningful only if the system can maintain and verify user sessions consistently. Session handling in KairosCV allows the system to recognize whether a user is currently authenticated and whether protected resources should be available.

Session-aware behavior affects:

1. Page access decisions.
2. Backend route authorization.
3. Dashboard personalization.
4. Retrieval of user-linked profile data.
5. Ownership-aware storage and history access.

This makes session handling an important foundation for the account-based behavior of the application.

## 12.8 User-Specific Resume History

One of the major reasons authentication matters in KairosCV is that generated resumes can be associated with specific users. This allows the system to present a personalized history view in the dashboard.

This feature supports:

1. Retrieval of recent generated resumes.
2. Ownership-aware access to outputs.
3. Better continuity for repeated platform use.
4. A stronger sense of the application as a personal workspace.

By linking resume outputs to authenticated users, the system becomes more useful over time rather than only during a single session.

## 12.9 Profile-Linked Operations

Authentication also supports operations beyond resume generation itself. The application includes profile-aware behaviors such as displaying user information and account-related data in the dashboard and settings pages.

This contributes to:

1. A more complete user experience.
2. Better personalization.
3. Stronger persistence of user state across sessions.

These features help position KairosCV as a full platform rather than only a processing endpoint.

## 12.10 Development Mode and Authentication Bypass

During implementation, development convenience was also an important concern. For this reason, KairosCV supports a configuration mode in which authentication can be bypassed during local development.

This was useful because it allowed us to:

1. Test resume processing flows quickly.
2. Avoid repeated dependency on authentication setup during local iteration.
3. Focus on pipeline development while still preserving production-style authentication behavior in the main design.

This bypass mode is a development aid, not a replacement for the intended protected architecture of the deployed application.

## 12.11 Access Control as a Quality Concern

From a software engineering perspective, access control in KairosCV is not only about preventing unauthorized access. It also contributes to system quality by making user behavior more predictable and by ensuring that personal data and generated artifacts are handled within clear ownership boundaries.

This is especially relevant because resumes contain personal and professional information. Protecting access to user-linked content is therefore an important aspect of platform responsibility.

## 12.12 Evaluation Perspective

From an academic evaluation standpoint, the authentication and access-control design strengthens the project in several ways:

1. It demonstrates platform realism.
2. It connects user identity with system persistence.
3. It reflects practical security awareness.
4. It improves the completeness of the user workflow.
5. It shows attention to deployment-oriented behavior rather than only prototype functionality.

These qualities make authentication and access control an important part of the project’s overall design maturity.

## 12.13 Chapter Summary

This chapter documented how authentication and access control are handled in KairosCV, including the use of Supabase, the protection of key application areas, session-aware behavior, user-linked resume history, profile-based operations, and development-oriented authentication bypass. Together, these mechanisms help ensure that the platform supports secure, personalized, and realistic application behavior.
# Chapter 13: API Design

## 13.1 Introduction

The API layer of KairosCV acts as the operational bridge between the frontend interface and the backend processing modules. Through these routes, the user interface is able to upload files, initiate processing, receive progress updates, retrieve generated outputs, and access account-related information. In this chapter, we document the design of the main API endpoints and explain their role within the overall platform.

A well-structured API design was important in this project because the frontend and backend needed to cooperate closely across multiple stages of the workflow. Instead of embedding all logic directly in the user interface, the system exposes controlled backend routes that define how major actions are performed.

## 13.2 Role of the API Layer

The API layer in KairosCV serves several key purposes:

1. It accepts user-submitted files and contextual inputs.
2. It triggers and coordinates backend processing.
3. It exposes progress communication endpoints.
4. It provides controlled access to generated outputs and stored data.
5. It supports account-specific profile and resume operations.

This structure allows the application to remain modular and makes each user action correspond to a clear backend entry point.

## 13.3 Design Principles of the API

While building the API layer, we followed a few practical design principles:

1. Separate routes by responsibility.
2. Keep input and output behavior explicit.
3. Connect routes to modular backend logic rather than large inline implementations.
4. Support account-aware behavior where needed.
5. Preserve a clear link between processing stages and route design.

These principles improved maintainability and made the backend easier to document in a report setting.

*Placeholder: Insert an API interaction diagram showing the main routes and how the frontend uses them during the resume optimization workflow.*

## 13.4 Upload Endpoint

One of the most important routes in the application is the upload endpoint. This route is responsible for receiving the resume file and the associated contextual inputs provided by the user.

The upload endpoint supports:

1. Resume file submission.
2. Optional job description capture.
3. Template selection capture.
4. Output format capture.
5. File validation and metadata registration.

This route does not complete the entire resume optimization process by itself. Instead, it acts as the formal intake point for the pipeline.

### 13.4.1 Importance of the Upload Route

The upload route is significant because it establishes the complete processing context for a resume. It ensures that the file and its associated preferences are registered properly before the pipeline begins.

This endpoint is also one of the first layers where security and reliability checks are enforced.

## 13.5 Stream Endpoint

After a successful upload, the frontend requires a way to monitor the ongoing optimization workflow. This is the responsibility of the stream endpoint.

The stream endpoint supports:

1. Real-time progress communication.
2. Stage-based status updates.
3. Completion signaling.
4. Error communication during processing.

This route is important because it exposes the backend pipeline to the frontend in a controlled and user-friendly way. Instead of requiring the frontend to guess or simulate progress, the API provides a direct feedback mechanism linked to actual processing.

## 13.6 Download Endpoint

The download endpoint is responsible for returning the final generated PDF to the user. Once resume optimization has completed successfully, this route becomes the main delivery point for the output artifact.

Its responsibilities include:

1. Validating the requested file identifier.
2. Ensuring access is permitted where authentication is required.
3. Retrieving the stored PDF output.
4. Returning it in a suitable response form for preview or download.

This endpoint represents the final output delivery stage of the user workflow.

## 13.7 JSON Retrieval Endpoint

KairosCV also includes a route that can expose the structured JSON representation of processed resume data. This is useful from a system and debugging perspective because it allows inspection of the internal structured result separate from the final PDF.

This route supports:

1. Visibility into extracted resume data.
2. Debugging of pipeline behavior.
3. Better inspection of structured intermediate results.

Although this is not the most visible endpoint from the user’s perspective, it is valuable for system transparency and development analysis.

## 13.8 Resume Management Endpoint

The application includes route support for managing stored resumes or generated resume records. This contributes to account-linked persistence and dashboard functionality.

Resume-related endpoints can support tasks such as:

1. Retrieving saved resume metadata.
2. Managing previously generated artifacts.
3. Enabling user-specific resume operations.

This part of the API design is important because it supports long-term platform use rather than only one-time processing.

## 13.9 Profile Endpoint

KairosCV also includes a profile-focused endpoint to support user account data and related settings behavior. This route helps connect the frontend account pages with user-linked backend data.

Profile routes contribute to:

1. Retrieval of user profile information.
2. Update of account-related settings where supported.
3. Consistent account-aware frontend behavior.

These routes strengthen the application as a reusable user platform.

## 13.10 Health and Supporting Endpoints

In addition to the primary operational routes, the application includes supporting routes such as health-related endpoints and mock-oriented helpers. These are useful for confirming that the application is functioning correctly and for testing specific communication behaviors where needed.

This reflects a more mature backend design because it recognizes that operational support and verification are also part of application quality.

## 13.11 Request and Response Patterns

The API design of KairosCV reflects a variety of response patterns depending on the task being performed.

These include:

1. Standard JSON responses for validation, metadata, and account-related operations.
2. Streaming responses for real-time processing updates.
3. Binary or file-oriented responses for PDF download delivery.

This variation is appropriate because the system performs different categories of work, and a single response style would not fit all of them effectively.

## 13.12 API and Backend Separation of Concerns

A key design strength of the API layer is that routes are not overloaded with all internal logic. Instead, they generally act as controlled interfaces into backend modules that handle the actual processing responsibilities.

This improves the project by:

1. Keeping route code easier to understand.
2. Reducing duplication of logic.
3. Making internal modules more reusable.
4. Strengthening maintainability and testability.

This separation is especially beneficial in a project with a multi-stage pipeline like KairosCV.

## 13.13 Importance of API Design in the Project

The API layer is important not only because it enables frontend-backend communication, but also because it reflects the structure of the entire system. Each route maps to a meaningful platform behavior such as upload, monitoring, retrieval, or account management.

This makes the API design an important part of the project’s engineering quality. It helps transform the application from a collection of isolated functions into a coherent platform.

## 13.14 Chapter Summary

This chapter documented the API design of KairosCV, including the upload, stream, download, JSON retrieval, resume management, profile, and health-oriented routes. It also explained the design principles behind the API layer and the different request-response patterns used across the application. Together, these routes form the operational interface through which the frontend interacts with the backend processing system.
# Chapter 14: Frontend Design and Components

## 14.1 Introduction

The frontend of KairosCV is the part of the application through which users experience the system. Although the backend performs the main resume-processing logic, the usefulness of the platform depends heavily on how clearly and effectively the interface presents that functionality. In this chapter, we document the frontend design of the application, the main pages and components, and the way the interface supports the overall workflow.

Our goal in the frontend was to keep the user experience simple and guided even though the underlying system performs technically complex processing. For this reason, the interface was designed around clarity, staged interaction, and minimal friction.

## 14.2 Frontend Design Objectives

The frontend design was guided by several objectives:

1. Make the upload and optimization process easy to understand.
2. Present processing feedback clearly.
3. Support account-based workflows such as dashboard history and settings.
4. Keep the interface visually consistent across pages.
5. Reduce unnecessary user effort while preserving flexibility.

These objectives helped ensure that the interface remained practical for end users while still reflecting the seriousness of the underlying system.

## 14.3 Page Structure

The frontend is organized into route-based pages and shared layout components. This gives the application a predictable structure while allowing individual pages to focus on specific user tasks.

The main pages include:

1. Login-related pages.
2. Landing or entry page behavior.
3. Dashboard page.
4. Optimize page.
5. Settings page.
6. Additional supporting pages such as contact-related or informational pages where relevant.

This page-based organization helps users move through the system in a logical sequence.

## 14.4 Layout and Navigation Design

The application uses shared layout and navigation elements to maintain consistency. These elements help users move between major areas of the system without losing orientation.

The design value of shared navigation includes:

1. Better continuity across pages.
2. Reduced cognitive load for users.
3. Stronger platform identity.
4. Easier access to the main workflows.

This consistency was important because the project is intended to function as a complete application rather than as an isolated feature page.

## 14.5 Optimize Page Interface

The optimize page is the central working area of the application and one of the most important frontend screens. It is where the user submits the resume and initiates the processing workflow.

The optimize page includes several key interface elements:

1. File upload area.
2. Job description input field.
3. Template selection controls.
4. Paper size selection.
5. Action controls to start optimization.

This page was designed to keep all major input decisions visible in one place so that the user can understand the processing context before beginning.

*Placeholder: Insert a screenshot of the optimize page showing the complete input interface before processing starts.*

## 14.6 File Upload Component

The file upload component is one of the most critical interactive parts of the frontend. It acts as the starting point of the technical workflow while also being one of the first points of user evaluation.

Its main responsibilities include:

1. Accepting file selection.
2. Reflecting file name and size.
3. Supporting supported-format constraints.
4. Allowing file removal or replacement before processing begins.

This component contributes significantly to first impressions because it determines how approachable the core workflow feels to the user.

## 14.7 Job Description Input Design

The optional job description field reflects an important design choice in the frontend. Rather than hiding role-specific tailoring behind a complex settings workflow, the interface places this option directly alongside the main upload action.

This was useful because:

1. It keeps context-aware optimization visible.
2. It allows users to understand the benefit of tailoring.
3. It avoids overcomplicating the interface.

By making the feature optional but accessible, the frontend supports both quick use and more targeted use.

## 14.8 Template Selection Interface

The template selector allows users to choose the style of the final output. We designed this as part of the optimize interface because template choice affects the user’s expectation of the final resume even before processing begins.

The interface value of the template selector includes:

1. Giving users a sense of control over presentation.
2. Supporting multiple output styles without changing content logic.
3. Making the application feel more complete and polished.

This feature is especially useful because it separates content optimization from visual preference.

## 14.9 Progress Tracker Component

Once processing begins, the progress tracker becomes one of the most important components on the screen. Its purpose is to translate backend processing events into understandable frontend feedback.

The component helps the user understand:

1. Which stage is running.
2. Approximately how much progress has been made.
3. Whether processing has completed or failed.

This component supports transparency and improves the usability of the application during longer-running operations.

*Placeholder: Insert a screenshot of the progress tracker in an active processing state.*

## 14.10 Results Panel

After optimization is complete, the results panel is responsible for presenting the output state and guiding the user toward the final action, which is retrieving the optimized resume.

Its purpose includes:

1. Showing that processing has finished.
2. Presenting output-related actions.
3. Supporting download or preview-oriented interaction.

This component is important because it serves as the endpoint of the user-facing workflow.

## 14.11 Dashboard Interface

The dashboard is the main account-oriented workspace of the application. It brings together user identity, usage information, and resume history in a single page.

The dashboard helps users:

1. Review available generations.
2. See previously generated resumes.
3. Start a new optimization quickly.
4. Understand their usage at a glance.

The design of the dashboard contributes to the platform identity of KairosCV by turning the application into a reusable personal workspace.

*Placeholder: Insert a screenshot of the dashboard showing the user summary, recent resumes, and new resume action.*

## 14.12 Settings Interface

The settings page supports account-oriented interaction beyond the resume workflow itself. It allows the application to present profile and usage-related information in a more organized way.

The value of the settings page includes:

1. Better personalization.
2. Clearer account management.
3. Separation between operational workflow and profile-related details.

Although secondary to the optimize page, it helps complete the overall platform experience.

*Placeholder: Insert a screenshot of the settings page showing profile and account-related details.*

## 14.13 Reusability Through Components

One of the strengths of the frontend architecture is its component-based structure. Instead of implementing each page independently from scratch, the system uses reusable interface elements and supporting hooks.

This contributes to:

1. Better maintainability.
2. More consistent UI behavior.
3. Easier extension of features.
4. Cleaner separation of interface responsibilities.

From a software engineering perspective, this supports a more disciplined frontend design.

## 14.14 Frontend Design as a User Experience Layer

The frontend of KairosCV should be understood not only as a visual shell, but as the layer that translates technical backend behavior into a usable product experience. Its quality affects whether users can understand, trust, and benefit from the system.

For this reason, the frontend was designed to:

1. Keep the workflow understandable.
2. Reduce user friction.
3. Surface important states clearly.
4. Support repeated usage over time.

This role makes the frontend an important part of the project’s overall success.

## 14.15 Chapter Summary

This chapter documented the frontend design and major components of KairosCV, including the page structure, navigation, optimize page interface, file upload component, job description input, template selector, progress tracker, results panel, dashboard, and settings interface. Together, these elements shape the user-facing side of the platform and make the backend functionality accessible in a clear and organized way.
# Chapter 15: Trial Limiting and Usage Control

## 15.1 Introduction

KairosCV includes a trial limiting and usage-control mechanism to manage how often resume generation can be performed within a defined time period. This feature is important because the application uses non-trivial backend resources, including AI-assisted processing and document generation. In this chapter, we document how usage limiting is designed and why it is relevant to the overall platform.

Usage control is not only a product feature. It also reflects operational awareness, resource management, and platform realism. Including this mechanism made the system more complete from both an engineering and deployment perspective.

## 15.2 Need for Usage Limiting

There are several reasons why usage limiting is useful in KairosCV:

1. Resume generation involves backend computation.
2. AI-assisted operations may consume external service capacity.
3. Unrestricted repeated use could affect system cost and fairness.
4. Controlled usage better reflects how a production platform would behave.

By including this mechanism, we ensured that the application accounts for the practical realities of resource consumption rather than assuming unlimited operation.

## 15.3 Free Trial Logic

The system supports a free usage model in which a limited number of generations are allowed within a defined time window. This approach allows users to experience the platform while also preventing unbounded consumption.

The free trial logic is designed to answer the following questions:

1. Is the current user allowed to start another generation?
2. How many attempts remain within the active window?
3. When will the limit reset?

This information can then be reflected in both backend decision-making and frontend communication.

## 15.4 Rolling Time Window

An important aspect of the usage-control design is that it operates within a rolling time window rather than only through a static daily reset assumption. This allows the system to calculate access more dynamically.

The value of a rolling window approach includes:

1. More accurate tracking of recent usage.
2. Better fairness across different user access times.
3. A more realistic rate-limiting model for repeated operations.

This design also strengthens the technical credibility of the platform because it reflects actual resource-management thinking.

## 15.5 Guest and Authenticated Handling

Usage limiting must operate differently depending on whether the user is authenticated. In authenticated scenarios, the system can link usage directly to account identity. In guest or bypass-oriented scenarios, alternate identification logic may be required.

This distinction is important because the application supports both controlled user-account workflows and development-friendly access patterns. Usage control therefore needed to be flexible enough to operate across these conditions.

## 15.6 Backend Enforcement of Limits

The usage limit is not enforced only in the user interface. It is checked in the backend during the upload and processing initiation stage. This is important because client-side restriction alone would not be reliable.

Backend enforcement ensures that:

1. Limits cannot be bypassed simply through frontend manipulation.
2. Validation occurs before expensive processing begins.
3. The system can return structured information about remaining access and reset timing.

This makes the usage-control feature more trustworthy and operationally meaningful.

## 15.7 User Feedback for Trial Status

An effective usage-control system should not only block requests when necessary; it should also communicate status clearly to the user. In KairosCV, usage information can be reflected through the interface so that the user understands:

1. How many generations remain.
2. Whether the current request is permitted.
3. When the usage window resets.

This improves the user experience because the platform becomes more transparent and less confusing when limits are encountered.

*Placeholder: Insert a screenshot of the dashboard or status message showing remaining generations and reset-related information.*

## 15.8 Supabase-Backed Trial Tracking

When account-aware persistence is enabled, usage tracking can be connected to backend data storage. This allows the system to maintain more reliable trial information across sessions and devices for authenticated users.

This contributes to:

1. Better persistence of usage state.
2. More accurate account-linked control.
3. Improved realism for platform operation.

From a system perspective, this makes usage limiting part of the broader persistence and account model rather than an isolated feature.

## 15.9 Development and Configuration Flexibility

KairosCV also supports configuration flexibility around usage limiting. This was useful during development because it allowed us to disable or adjust trial behavior when needed for testing the pipeline itself.

This flexibility was important because strict runtime controls can slow development if they are not configurable. By making usage limiting environment-aware, we preserved both operational realism and implementation convenience.

## 15.10 Usage Control as a Platform Design Decision

Including usage control strengthened the project because it demonstrated that we considered the system not just as a technical demo, but as a realistic application that consumes resources and may need to manage access fairly.

This design decision contributes to:

1. Better operational awareness.
2. Stronger production readiness.
3. More complete user-account behavior.
4. A more credible application model for evaluation.

## 15.11 Evaluation Perspective

From an academic evaluation standpoint, trial limiting and usage control are valuable because they show that the project considers practical constraints in addition to pure functionality. A system that processes AI-assisted documents at scale must eventually account for access control, fairness, and cost-awareness.

By implementing this mechanism, we demonstrated that the platform design extends beyond algorithmic processing and includes operational planning as well.

## 15.12 Chapter Summary

This chapter documented the trial limiting and usage-control design of KairosCV, including the need for controlled access, the free usage model, the rolling time window, guest and authenticated handling, backend enforcement, user feedback, Supabase-backed tracking, and configuration flexibility. Together, these features make the platform more realistic, operationally aware, and better suited for sustained use.

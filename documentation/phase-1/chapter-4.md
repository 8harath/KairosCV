# Chapter 4: User Workflow

## 4.1 Introduction

Although KairosCV contains a technically complex backend workflow, the application is designed to provide users with a simple and structured interaction model. From the user’s point of view, the platform should feel guided, transparent, and efficient. In this chapter, we describe how a typical user interacts with the system from entry into the application up to the generation and retrieval of the optimized resume.

Documenting the workflow in this way is important for evaluation because it shows how the project translates technical functionality into a usable product experience.

## 4.2 Entry into the Application

The user journey begins when the user opens the KairosCV application. At this stage, access behavior depends on the system configuration.

In standard operation, pages such as the dashboard, optimize page, and settings page are protected. If the user has not authenticated, the system redirects them to the login page. If the user is already authenticated, the application allows access to the appropriate workspace pages.

For development and testing scenarios, the system also supports an authentication bypass configuration. This was useful during implementation because it allowed us to test core resume processing features without requiring a full login setup in every local run.

*Placeholder: Insert a screenshot of the landing page or login page used as the application entry point.*

## 4.3 Authentication Workflow

Authentication is an important part of the user flow because it enables account-based usage rather than anonymous one-time processing alone. By connecting generated outputs to user accounts, the system can support persistence, resume history, and profile management.

The authentication workflow can be summarized as follows:

1. The user signs up or logs in through the application’s authentication interface.
2. The session is verified when protected pages are accessed.
3. Unauthenticated users are redirected away from restricted pages.
4. Authenticated users are granted access to the dashboard, settings, and resume optimization workflow.

This structure contributes to both usability and access control. It also makes the application more realistic as a deployable platform.

## 4.4 Dashboard Workflow

After successful authentication, the dashboard acts as the user’s main workspace. We designed it to provide an immediate summary of the user’s activity and available actions.

The dashboard presents:

1. Basic user information.
2. Remaining free generations within the active time window.
3. Recently generated resumes.
4. A direct option to create a new optimized resume.

This design reduces navigation overhead and gives the user a clear sense of status before starting a new processing cycle.

From a product perspective, the dashboard is valuable because it turns KairosCV into a reusable platform rather than a single-page utility.

*Placeholder: Insert a screenshot of the dashboard showing user information, resume history, and the “New resume” action.*

## 4.5 Resume Optimization Workflow

The optimize page is the central functional area of the application. It is where the user provides input and initiates the core processing pipeline.

### Resume Upload

The user begins by selecting a file in one of the supported formats: PDF, DOCX, or TXT. The interface checks whether the file type and size fall within the accepted range before allowing processing to continue.

This validation helps prevent avoidable failures and improves the reliability of the user experience.

### Optional Job Description Input

The user may paste a job description into the provided text area. We included this feature because resume optimization is often context-dependent. A resume that is suitable for one role may need different emphasis for another. By allowing job description input, the system can tailor certain improvements more effectively.

### Template Selection

The optimize page also allows the user to choose a preferred resume template. This affects the visual presentation of the final output while leaving the underlying extraction and enhancement workflow unchanged.

### Paper Format Selection

The user can select the intended paper format, such as Letter or A4. This is helpful because formatting expectations can vary depending on region or submission context.

### Initiating Processing

Once the resume and optional configuration inputs are ready, the user starts the optimization process. At this point, the file is uploaded and the backend workflow begins.

*Placeholder: Insert a screenshot of the optimize page showing the job description field, template options, paper format selection, and upload area.*

## 4.6 Real-Time Progress Workflow

One of the important usability features of KairosCV is its real-time progress feedback. Since resume optimization involves multiple backend stages, we considered it important that the user should not be left waiting without context.

During processing, the interface displays:

1. The current stage of the workflow.
2. Approximate percentage completion.
3. A short status message indicating what the system is doing.

This design improves transparency and makes the system feel responsive. It also helps communicate that optimization is a staged process rather than a single instant operation.

Examples of stages shown to the user may include parsing, extraction, enhancement, validation, scoring, and PDF generation.

*Placeholder: Insert a screenshot of the progress tracker while a resume is actively being processed.*

## 4.7 Result and Download Workflow

After processing is completed successfully, the system presents the optimized result to the user. At this stage, the user’s main task is straightforward: obtain the finished PDF.

The result workflow includes:

1. Confirmation that processing has completed.
2. Availability of the generated PDF.
3. Download access for the optimized resume.
4. Possible continued access later through dashboard-based resume history.

This final stage is particularly important because it is where the technical work of the backend is converted into visible user value.

*Placeholder: Insert a screenshot of the final results panel or completed download state.*

## 4.8 Resume History Workflow

For authenticated users, the generated resume does not disappear after download. Instead, the system stores metadata that allows previously generated resumes to be listed in the dashboard.

This supports repeated usage in two important ways:

1. Users can revisit earlier outputs without repeating the entire process immediately.
2. Users can maintain multiple generated versions across time.

This history-oriented design is beneficial for users applying to different roles or iterating on multiple resume variations.

## 4.9 Settings and Profile Workflow

The system also includes a settings area where users can manage profile-related information and review account-level details. While this section is secondary to the resume optimization flow, it contributes to the completeness of the platform.

The settings workflow may involve:

1. Viewing profile details.
2. Managing user-related preferences or avatar settings.
3. Reviewing account usage information.
4. Accessing account-related status in a centralized location.

Including this page makes the application feel more like a complete user platform rather than a single-purpose processing screen.

*Placeholder: Insert a screenshot of the settings page showing profile and usage information.*

## 4.10 End-to-End User Journey

The end-to-end user journey through KairosCV can be summarized in the following sequence:

1. The user enters the application.
2. The user authenticates if required.
3. The user reaches the dashboard.
4. The user starts a new optimization workflow.
5. The user uploads a resume and optionally adds job context.
6. The system processes the file and shows live progress.
7. The optimized PDF becomes available.
8. The user downloads the result and may later revisit it from the dashboard.

This end-to-end flow demonstrates that KairosCV is designed not only to process resumes effectively but also to present that functionality through a user-friendly interface.

## 4.11 Observations from the Workflow Design

From the perspective of system design, we observed that a strong user workflow depends on balancing simplicity with transparency. Resume optimization involves technically dense backend processing, but the user should not need to understand all underlying details in order to benefit from the platform.

For this reason, our workflow design emphasized:

1. Minimal user-side friction.
2. Clear step-by-step interaction.
3. Visible processing feedback.
4. Easy result retrieval.
5. Continued access through dashboard history.

These decisions were important in ensuring that the system remains practical and accessible.

*Placeholder: Insert a user journey diagram showing login or entry -> dashboard -> optimize -> progress tracking -> results -> resume history.*

## 4.12 Chapter Summary

In this chapter, we documented the user workflow of KairosCV, beginning from entry into the system and extending through authentication, dashboard usage, resume optimization, real-time progress tracking, result download, resume history, and settings access. This workflow demonstrates how the application presents a clear and manageable experience to users despite the complexity of the internal processing pipeline.

With the user-facing flow now documented, the next phase of the report can examine the deeper internal architecture and operational logic of the system.

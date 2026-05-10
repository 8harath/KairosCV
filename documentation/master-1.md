# Phase 1: Foundation and Project Context

## Contents

1. Introduction
   - Project overview
   - Problem statement
   - Goals and objectives
   - Target users
   - Scope of the capstone

2. System Overview
   - What KairosCV does
   - High-level workflow
   - Core features
   - Key technical capabilities
   - Constraints and assumptions

3. Technology Stack
   - Frameworks and libraries
   - AI services used
   - Database and storage
   - Authentication system
   - Testing and deployment tools

4. User Workflow
   - Landing and authentication flow
   - Dashboard flow
   - Resume optimization flow
   - Settings/profile flow
   - Download and resume history flow
# Chapter 1: Introduction

## 1.1 Overview of the Project

As part of our capstone work, we designed and developed **KairosCV**, an AI-powered resume optimization platform intended to assist users in converting their existing resumes into clearer, stronger, and more ATS-compatible documents. The system accepts resume files in common formats such as PDF, DOCX, and TXT, processes the uploaded content through a structured backend pipeline, and produces an optimized one-page PDF output.

Our intention in developing this project was not only to build a resume formatter, but to create a complete processing system that could understand raw resume content, organize it into structured sections, improve the quality of written content, and deliver the result in a professional format suitable for job applications. To achieve this, we combined frontend development, backend processing, AI-based enhancement, validation logic, storage support, and PDF rendering into a single web application.

KairosCV represents a practical application of full-stack software engineering and applied artificial intelligence. It demonstrates how unstructured user documents can be transformed into structured, reusable, and professionally formatted outputs through a coordinated software pipeline.

*Placeholder: Insert a screenshot of the main KairosCV interface, preferably the optimize page or landing page, to introduce the project visually.*

## 1.2 Background and Motivation

During the early planning stage of this capstone, we identified resume preparation as a common and practical problem faced by students, recent graduates, and job seekers. While many candidates possess the required academic background, technical skills, or project experience, they often struggle to present these effectively in a resume that is concise, well-organized, and optimized for Applicant Tracking Systems.

In many cases, resume quality is affected by issues such as:

1. Weak or repetitive bullet points.
2. Inconsistent formatting across sections.
3. Poor prioritization of important content.
4. Missing ATS-friendly keywords.
5. Resumes exceeding recommended length.
6. Difficulty converting content from one format into another without losing structure.

We also observed that existing tools usually focus on only one part of the problem. Some provide visual templates but do not improve the written content. Others offer general text assistance but lack a structured workflow for extracting and organizing resume information. This motivated us to build a system that treats resume optimization as a complete engineering problem rather than a simple text-editing task.

## 1.3 Problem Statement

The problem addressed by this project is the difficulty of transforming an existing resume into a concise, professionally formatted, and ATS-compatible document without requiring extensive manual editing.

Users often maintain resumes in different formats and with varying levels of quality. When such resumes are submitted directly, important information may be hidden behind poor structure, unclear language, or formatting choices that are difficult for both recruiters and automated screening systems to interpret. As a result, otherwise qualified candidates may fail to make a strong first impression.

From a technical point of view, the challenge is also significant. Resume files are semi-structured documents that may contain irregular layouts, inconsistent headings, dense bullet sections, and mixed formatting patterns. Building a system that can reliably process such files requires careful handling of input validation, content extraction, AI-based interpretation, structured data conversion, and final output rendering.

Therefore, the central problem we aimed to solve was:

How can we build an intelligent web-based system that accepts existing resumes, extracts and improves their content, and generates a professional one-page PDF output suitable for job applications?

## 1.4 Aim of the Project

The main aim of our project is to develop a web application that automates resume optimization through AI-assisted processing and structured document generation.

Through KairosCV, we aimed to create a system that reduces the effort required from users while still preserving the integrity of their original information. Rather than asking users to build a resume manually from scratch, the system works from an already existing document and improves it through multiple backend stages.

## 1.5 Objectives of the Project

To achieve the above aim, we defined the following objectives for the capstone:

1. To support resume upload in multiple formats, specifically PDF, DOCX, and TXT.
2. To validate uploaded files securely before processing.
3. To extract text from resumes while preserving as much information as possible.
4. To convert extracted content into structured resume sections such as contact details, education, experience, projects, and skills.
5. To apply AI-based enhancement to improve summary text and experience bullet points.
6. To optionally tailor resume output according to a user-provided job description.
7. To validate and clean extracted data before final rendering.
8. To generate a professional single-page PDF using selectable templates.
9. To provide an interactive user experience with progress tracking and download support.
10. To support account-based usage with dashboard access, resume history, and settings management.

These objectives guided both our design decisions and our implementation strategy throughout the project lifecycle.

## 1.6 Scope of the Project

The scope of KairosCV covers the development of a complete web-based resume optimization workflow. Our implementation includes both user-facing application features and backend processing capabilities necessary to transform uploaded resumes into downloadable outputs.

The scope of the project includes:

1. User authentication and protected access to key pages.
2. Resume upload and file validation.
3. Multi-format parsing and text extraction.
4. AI-assisted content structuring and improvement.
5. Validation and normalization of extracted data.
6. One-page PDF generation using predefined templates.
7. Resume storage and retrieval for authenticated users.
8. Usage tracking and trial-based access control.

At the same time, the project does not attempt to cover the entire recruitment ecosystem. The current scope does not include:

1. Automatic job application submission.
2. Candidate ranking against other applicants.
3. Interview scheduling or recruiter dashboards.
4. End-to-end hiring workflow automation.
5. Human-level domain review for every generated result.

By keeping the scope focused, we were able to design a system that solves a specific and meaningful problem in a technically rich way.

## 1.7 Target Users

While designing KairosCV, we focused on users who are likely to benefit directly from guided resume improvement and structured output generation.

### Students and Recent Graduates

This group often has strong academic or project experience but may not yet know how to present that information effectively in a professional resume. KairosCV helps by reorganizing content and improving wording without requiring deep knowledge of resume writing conventions.

### Job Seekers

Users actively applying for internships or full-time roles frequently need to refine multiple resume versions. Our system can help them improve structure, strengthen phrasing, and align content more closely with job descriptions.

### Early-Career Professionals

Professionals in the early stages of their careers may already have resumes but still need help maintaining clarity, conciseness, and modern ATS-friendly formatting. KairosCV offers a convenient way to upgrade existing documents into more polished versions.

### Academic Mentors and Placement Support Teams

Although not the primary audience, the system could also support mentors, placement cells, or resume review groups who want a faster way to help large numbers of students improve resume quality.

## 1.8 Significance of the Project

We consider this project significant for both practical and academic reasons.

From a practical perspective, KairosCV addresses a real and recurring need. Resume quality can directly influence internship and job opportunities, especially in competitive environments where initial evaluation often happens quickly and through automated screening systems. A system that improves the clarity and structure of resumes therefore has immediate real-world value.

From an academic and technical perspective, the project demonstrates:

1. Full-stack web application development.
2. Integration of AI services into a real workflow.
3. Processing of unstructured and semi-structured documents.
4. Validation of machine-generated or AI-assisted outputs.
5. Generation of professional PDF documents from structured data.
6. The design of a modular and extensible processing pipeline.

For a capstone project, this makes KairosCV a meaningful combination of problem-solving, system design, and applied software engineering.

## 1.9 Methodological Perspective

Our development approach treated the resume as both a document and a data source. This perspective shaped the system into multiple cooperating stages rather than a single monolithic process. Instead of merely editing text, we built a pipeline that reads the file, extracts the information, organizes it, enhances it, validates it, and finally renders it into a polished output.

This staged approach also allowed us to think about reliability, fallback behavior, and quality control. It helped ensure that each part of the system had a clear responsibility within the overall flow.

*Placeholder: Insert a simple conceptual diagram showing uploaded resume -> extraction -> enhancement -> validation -> PDF output.*

## 1.10 Chapter Summary

In this chapter, we introduced KairosCV as the capstone project developed by our team to address the problem of resume optimization. We presented the background and motivation for the work, defined the problem statement, described the aim and objectives, identified the scope of the implementation, and highlighted the significance of the project. These points establish the foundation for the remainder of the report.

In the next chapter, we provide a high-level system overview and explain how KairosCV functions from a broader product and workflow perspective.
# Chapter 2: System Overview

## 2.1 Introduction

After defining the motivation and objectives of the project, it is necessary to present a broad view of the system itself. In this chapter, we describe KairosCV at a functional level, focusing on what the system does, how the major features are organized, and how a user moves through the platform from input to final output.

KairosCV is a web-based application that transforms an uploaded resume into an optimized one-page PDF through a multi-stage processing workflow. Although the internal implementation involves several technical layers, the system is designed to provide a simple and guided experience from the user’s perspective.

## 2.2 General Description of the System

KairosCV can be described as an intelligent resume processing and optimization system. Its primary role is to accept an existing resume, extract and interpret the content of that document, improve the quality of selected sections, and generate a professionally formatted final version.

Unlike a conventional resume builder where a user manually fills out fields one by one, KairosCV begins with an already available document. This makes the system more practical for users who have content prepared but need help improving clarity, organization, and presentation.

The system combines:

1. File upload and validation.
2. Resume text extraction.
3. AI-assisted information structuring.
4. Resume content enhancement.
5. Validation and cleanup of processed data.
6. Template-driven PDF generation.
7. User-specific storage and retrieval features.

Taken together, these functions allow KairosCV to act as both a processing tool and a personalized resume workspace.

## 2.3 Main Purpose of the System

The main purpose of KairosCV is to reduce the effort and uncertainty involved in resume improvement. We designed the system to help users achieve the following outcomes:

1. Convert raw resumes into cleaner and more organized formats.
2. Improve the professional quality of written descriptions.
3. Increase compatibility with ATS-based screening systems.
4. Produce a concise and visually consistent one-page resume.
5. Preserve useful information from the original document while restructuring it effectively.

This purpose guided the overall design of the application and influenced both technical and interface-related decisions.

## 2.4 High-Level Working Flow

At a high level, the working of KairosCV follows a structured sequence of operations.

1. The user accesses the application and logs in if authentication is enabled.
2. The user uploads a resume file through the optimize page.
3. The user may optionally provide a job description and choose a template and paper format.
4. The backend validates and stores the uploaded file.
5. The system extracts raw text from the resume.
6. The extracted content is processed into structured resume data.
7. AI services enhance important sections such as summaries and bullet points.
8. The system validates and cleans the processed data.
9. The final resume is rendered into a one-page PDF.
10. The user downloads the optimized resume or accesses it later from the dashboard.

This flow is intentionally modular. Each stage contributes a specific transformation, and together they create the final optimized result.

*Placeholder: Insert a high-level workflow diagram showing the full system flow from upload to optimized PDF download.*

## 2.5 Major Functional Modules

To understand the system clearly, it is useful to view KairosCV as a collection of cooperating modules.

### Resume Upload Module

This module handles file submission from the user. It is responsible for receiving resume files, checking their format and size, and preparing them for backend processing.

### Extraction and Parsing Module

Once the file is accepted, the system extracts textual content from the uploaded document. Since different file types contain data differently, this module handles PDF, DOCX, and TXT inputs using suitable strategies.

### Structured Data Processing Module

The raw extracted content is converted into structured sections such as contact information, education, experience, projects, and skills. This stage is central to the overall design because it turns an unstructured document into a machine-usable data model.

### AI Enhancement Module

This module improves the quality of the resume content. It supports tasks such as refining bullet points, generating summaries, and tailoring certain outputs based on job descriptions.

### Validation and Cleanup Module

The system checks processed data for consistency, completeness, and formatting quality. Missing fields, duplicate entries, and irregular structures are addressed before final rendering.

### PDF Generation Module

After the content is finalized, the system renders the data using a selected resume template and generates a one-page PDF output.

### User Management Module

This module handles login, protected access, profile settings, usage tracking, and dashboard-based resume history for authenticated users.

## 2.6 Core Features of the System

During implementation, we focused on features that directly support the project’s goal of practical resume optimization.

### Multi-Format Resume Support

The system accepts PDF, DOCX, and TXT files, allowing users to work with resumes in commonly used formats.

### AI-Powered Content Improvement

KairosCV uses AI to improve language quality, summarize information more effectively, and strengthen the presentation of professional experience.

### Template-Based Output

Users can choose among multiple templates for the final resume output. This allows the same structured content to be rendered in different presentation styles.

### One-Page PDF Generation

The final output is designed to fit on a single page, which is often preferred for professional resume submissions.

### Real-Time Progress Feedback

The application informs users of the progress of processing stages, making the experience more transparent and responsive.

### Dashboard and Resume History

Authenticated users can return to previously generated resumes and manage their usage through the dashboard.

### Optional Job Description Tailoring

By allowing users to provide a target job description, the system can adjust certain enhancements to make the final output more role-focused.

## 2.7 User-Centered Design Perspective

One of the key considerations in this project was ensuring that the complexity of the backend workflow does not create friction for the user. The internal processing pipeline is technically detailed, but the user experience is intentionally simple:

1. Upload a file.
2. Optionally provide job context.
3. Monitor processing progress.
4. Download the result.

This separation between internal complexity and external simplicity is an important design strength of the system. It allows the platform to deliver advanced functionality without overwhelming the user.

*Placeholder: Insert a screenshot of the optimize interface showing the resume upload area, job description input, and template selection controls.*

## 2.8 System Behavior Under Different Use Cases

KairosCV is designed to support more than one type of user interaction pattern.

### First-Time User Flow

A new user may log in, access the dashboard, start the optimization process, upload a resume, and receive a first optimized output. This flow emphasizes onboarding and ease of use.

### Repeated Optimization Flow

A returning user may use the platform to generate updated versions of a resume over time, possibly for different job descriptions or template preferences.

### Development and Testing Flow

In local development contexts, authentication can be bypassed to simplify testing. This makes it easier to verify the technical workflow without requiring the full cloud authentication setup at every stage.

These variations show that the system was designed with both end-user practicality and implementation flexibility in mind.

## 2.9 Constraints and Operating Assumptions

For the system to perform effectively, certain assumptions are made.

1. The uploaded file must belong to a supported format.
2. The content of the resume should be reasonably readable and relevant.
3. AI services should be available and configured properly.
4. The final output is intended to prioritize professionalism and ATS readability over highly artistic styling.

We also recognize practical constraints, such as:

1. Highly complex document layouts may affect extraction accuracy.
2. AI-enhanced content may still benefit from user review.
3. A strict one-page output requirement can limit the amount of detail shown in the final PDF.

Including these points in the overview is important for evaluation because it reflects realistic system behavior rather than idealized assumptions.

## 2.10 Role of the System in the Overall Capstone

Within the scope of our capstone, KairosCV serves as the central artifact that demonstrates our application of software engineering principles to a practical problem. It integrates frontend interaction, backend orchestration, AI services, validation logic, storage handling, and output generation into one coherent system.

Because of this, the project is not only a functional application but also a technical case study in building reliable AI-assisted document workflows.

## 2.11 Chapter Summary

In this chapter, we provided a broad overview of KairosCV as a system. We explained its purpose, described its high-level working flow, identified the major functional modules, outlined the main features, and discussed the design perspective that shaped the user experience. This chapter establishes the overall structure of the application before deeper technical details are introduced.

In the next chapter, we discuss the technology stack used to implement the system and explain the role of each major framework, library, and service.
# Chapter 3: Technology Stack

## 3.1 Introduction

The successful implementation of KairosCV required a technology stack capable of supporting modern web interaction, backend document processing, AI integration, secure user handling, and reliable PDF generation. Since the project involves both user-facing and system-intensive operations, the chosen stack had to balance development speed, maintainability, deployment readiness, and processing capability.

In this chapter, we document the main technologies used in the project and explain why each one was relevant to our implementation.

## 3.2 Application Framework

### Next.js

We selected Next.js as the main framework for KairosCV because it provides a unified environment for building both the frontend and backend of a web application. Instead of maintaining separate client and server repositories, we were able to organize pages, API routes, middleware, and server-side logic within one structured project.

This choice supported our implementation in several ways:

1. It simplified project organization.
2. It allowed us to build page-based navigation and backend endpoints together.
3. It supported server-side processing workflows needed for file handling and PDF generation.
4. It enabled production-oriented deployment patterns.

For a capstone project, this was especially useful because it reduced unnecessary complexity while still allowing us to build a realistic full-stack system.

### React

React serves as the foundation of the frontend interface. Through reusable components, we structured the user experience into separate functional parts such as the uploader, progress tracker, dashboard elements, settings interface, and results view.

React was appropriate for this project because KairosCV is not a static website. The system must respond dynamically to user input, processing states, validation results, and download availability. A component-based architecture therefore made the interface more maintainable and easier to extend.

### TypeScript

We used TypeScript throughout the application to improve correctness and code reliability. Since our system depends heavily on structured data such as resume objects, metadata records, processing states, and API payloads, strong typing helped us reduce ambiguity and improve internal consistency.

From an engineering perspective, TypeScript contributed to:

1. Better maintainability.
2. Safer handling of structured resume data.
3. Easier debugging during implementation.
4. Improved readability of module interactions.

## 3.3 Frontend Styling and UI Support

### Tailwind CSS

Tailwind CSS was used to build the visual layout of the application. We chose it because it allows fast and consistent interface development using utility-based styling, which was useful in a project containing multiple screens and reusable panels.

With Tailwind CSS, we were able to maintain consistency across:

1. The optimize page.
2. The dashboard.
3. The settings page.
4. Buttons, cards, panels, and form elements.

This approach helped us build a clean and functional interface without maintaining a large amount of custom CSS.

### Radix UI and Related UI Libraries

To improve usability and accessibility, the project also uses UI primitives and supporting libraries that simplify the creation of interactive components. These assist with elements such as dialogs, labels, dropdown menus, toasts, and other interface controls.

This was important because the user-facing side of KairosCV needed to remain polished and reliable while the core effort remained focused on the processing pipeline.

## 3.4 AI and Intelligent Processing Layer

### Groq

Groq is used as the primary AI service within the project for enhancement-oriented operations. In our implementation, AI is involved in generating or improving content such as summaries, refining bullet points, and supporting resume enhancement logic.

We adopted this service because resume optimization depends not only on extracting text but also on improving how that text is expressed. A purely rule-based system would be limited in its ability to produce natural, role-appropriate, and professionally worded content.

### Google Gemini

Google Gemini is also integrated into the system as part of the broader AI processing strategy. In the project structure, Gemini-related modules support extraction, verification, and fallback-oriented tasks in the pipeline.

This layered approach to AI usage improved system flexibility. Rather than depending on a single model path for every stage, we designed the application so that different services could contribute to different responsibilities.

### Significance of AI in the Stack

AI is one of the defining aspects of KairosCV. Its role is not cosmetic. It directly affects the usefulness of the final output by helping the system:

1. Interpret resume content more intelligently.
2. Improve wording quality.
3. Organize extracted information more effectively.
4. Support job-description-aware optimization.

For this reason, the AI layer is central to the project’s technical identity.

## 3.5 Resume Parsing and Extraction Technologies

### PDF Processing Support

PDF resumes are processed using parsing tools and supporting logic that extract textual content from uploaded files. We included this because PDF is one of the most common formats in which resumes are shared, yet it is also one of the most challenging to process reliably due to layout-based complexity.

The system therefore includes enhanced PDF handling instead of assuming that all text can be extracted cleanly in a single pass.

### Mammoth for DOCX Files

For DOCX input, the project uses Mammoth to convert document content into a more usable textual or HTML-oriented form. This is important because resumes created in word processors often contain more consistent internal structure than PDFs, and preserving that structure can improve later stages of extraction.

### TXT File Handling

Plain text input is also supported. Although simpler than PDF or DOCX processing, including TXT support ensures that the system remains flexible and can work even with minimally formatted resumes.

### Vision-Assisted Verification

One of the more notable technical aspects of the stack is the inclusion of vision-assisted or OCR-supported verification behavior for difficult documents. This reflects our effort to improve robustness in cases where text-based extraction may not fully preserve the resume content.

This addition is important in an evaluation context because it shows that the system was designed with real-world document irregularities in mind.

## 3.6 Validation and Data Integrity

### Zod

We used Zod for schema validation in order to enforce structure on the processed resume data. After extraction and enhancement, the information must still be checked for completeness, consistency, and expected shape before it can be used safely for final rendering.

Validation plays an important role in the overall system because it:

1. Prevents malformed data from moving deeper into the pipeline.
2. Supports safer PDF rendering.
3. Provides a consistent structure for different resume inputs.
4. Helps the system recover by filling defaults where appropriate.

This makes Zod a key part of the quality-control layer of the application.

## 3.7 Authentication and Persistence Layer

### Supabase

Supabase was selected to support authentication, profile management, and cloud-backed data handling. It provides the infrastructure necessary for user sessions, protected routes, account-linked resume history, and optional remote storage.

This was an effective choice for the project because it allowed us to implement production-style user management without building a custom authentication system from the ground up.

### Local Storage Support

In addition to cloud-backed operation, the project also supports local file storage. This was useful during development and testing because it reduced setup overhead and allowed the processing pipeline to function even when a full cloud environment was not required.

The dual approach of local and Supabase-backed storage improved flexibility and made the system easier to evaluate in different contexts.

## 3.8 PDF Generation and Template Rendering

### Puppeteer

Puppeteer is used to generate the final PDF output from rendered HTML resume templates. We selected this approach because it provides precise control over layout, spacing, and page fitting.

This was especially important because one of the core goals of KairosCV is to produce a clean one-page resume. Achieving that reliably requires stronger rendering control than simple client-side export techniques usually provide.

### HTML-Based Templates

The application includes multiple HTML templates for resume output. This design separates content processing from visual presentation. Once the resume data is structured and cleaned, it can be rendered into different formats without changing the underlying extraction logic.

This separation improves maintainability and makes future template expansion easier.

*Placeholder: Insert a screenshot of the template selection area or sample outputs from the available resume templates.*

## 3.9 Testing and Quality Assurance Support

### Vitest

We used Vitest as the testing framework for the project. Testing is particularly important in KairosCV because the system contains several transformation stages where subtle issues can affect final output quality.

By including test coverage around selected modules, especially processing and rendering-related logic, we strengthened confidence in the reliability of critical features.

Testing in this project contributes to:

1. Early detection of regressions.
2. Validation of parser behavior.
3. Confidence in template rendering logic.
4. Better maintainability during iteration.

## 3.10 Deployment-Oriented Technologies

### Render and Vercel Support

The project includes configuration for deployment on platforms such as Render and Vercel. Including deployment support was important because it demonstrates that the system can be executed in a hosted environment and is not limited to a purely local prototype.

From an evaluation standpoint, deployment readiness reflects project maturity. It indicates that we considered environment configuration, runtime dependencies, and production-like execution.

## 3.11 Technology Selection Rationale

The selected technology stack was shaped by the project’s actual needs rather than by preference alone. Each technology contributes to a specific requirement of the system:

1. Next.js supports the full-stack application model.
2. React enables an interactive and modular user interface.
3. TypeScript improves safety and maintainability.
4. Tailwind CSS supports fast and consistent UI styling.
5. AI services enable intelligent content extraction and improvement.
6. Zod helps enforce data integrity.
7. Supabase provides authentication and persistence support.
8. Puppeteer enables controlled PDF generation.

Together, these tools allowed us to build a system that is technically coherent, practical to use, and realistic in terms of engineering scope for a capstone project.

## 3.12 Chapter Summary

In this chapter, we documented the technology stack used to build KairosCV and explained the role played by each major framework, library, and external service. The selected technologies collectively support the project’s core needs: web interaction, document handling, AI-assisted processing, validation, storage, and PDF output generation.

In the next chapter, we shift from the implementation technologies to the user journey and describe how the system is experienced from login through resume generation and download.

*Placeholder: Insert a technology stack diagram showing frontend, backend, AI services, validation, storage, and output generation layers.*
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

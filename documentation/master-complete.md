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
# Phase 3: Extraction, AI, and Data Handling

## Contents

1. Parsing and Extraction Internals
   - PDF extraction strategy
   - DOCX extraction strategy
   - TXT parsing strategy
   - OCR / vision-assisted verification
   - Section detection and schema mapping
   - Handling incomplete or messy resumes
   - Zero-data-loss approach

2. AI Integration
   - Why AI is used
   - Primary and fallback model strategy
   - Bullet-point enhancement
   - Summary generation
   - Skill categorization
   - Field classification and validation
   - Tailoring content to job descriptions

3. Data Model and Validation
   - Resume schema structure
   - Contact, education, experience, projects, skills
   - Optional/custom sections
   - Validation with Zod
   - Default filling and fallback behavior
   - Confidence scoring logic

4. Storage and Persistence
   - Local file storage flow
   - Supabase storage flow
   - Metadata storage
   - Generated PDF storage
   - JSON/debug artifact storage
   - Cleanup and retention behavior
# Chapter 8: Parsing and Extraction Internals

## 8.1 Introduction

One of the most technically important parts of KairosCV is the ability to convert uploaded resume files into usable text and structured information. Since resumes are not submitted in a single consistent format, the system must be able to process different document types while preserving as much information as possible. In this chapter, we document the internal parsing and extraction mechanisms used in the project and explain how they support the broader optimization workflow.

While building the system, we recognized that extraction quality would directly affect every later stage of processing. If the system fails to recover the original information correctly, then even strong AI enhancement and PDF generation cannot fully compensate for that loss. For this reason, we treated parsing and extraction as a foundational part of the architecture rather than a minor preprocessing step.

## 8.2 Nature of the Extraction Problem

Resume documents present a difficult extraction challenge because they are semi-structured rather than fully standardized. Although most resumes contain familiar sections such as education, experience, and skills, the arrangement of this information can vary significantly from one document to another.

The difficulty arises from several common characteristics:

1. Different file formats represent content differently.
2. Section headings may use inconsistent terminology.
3. PDF files may contain columns, tables, or irregular spacing.
4. Important content may appear in compressed bullet structures.
5. Users may follow personal formatting styles rather than standard templates.

Because of these conditions, the extraction layer of KairosCV had to be designed with flexibility and fallback support in mind.

## 8.3 Input Formats Supported by the System

KairosCV supports three primary input formats:

1. PDF
2. DOCX
3. TXT

These formats were selected because they represent the most common ways in which users store and submit resumes. Each format presents different processing requirements, and therefore the system uses different extraction strategies depending on the uploaded file type.

## 8.4 PDF Extraction Strategy

PDF extraction is the most complex parsing scenario in KairosCV. Unlike plain text or word-processing formats, PDFs are often optimized for visual presentation rather than logical text recovery. As a result, extracting readable and correctly ordered content from PDFs is challenging.

Our PDF extraction strategy is designed to improve reliability by using enhanced text extraction methods and, where available, additional verification support. The goal is to recover as much meaningful text as possible while reducing the effects of layout-based distortion.

### 8.4.1 Why PDF Parsing Is Difficult

PDF documents often contain:

1. Multi-column layouts.
2. Unusual spacing patterns.
3. Tables or visually aligned content blocks.
4. Bullet points that are not always represented cleanly in raw text extraction.
5. Text ordering issues caused by layout structure rather than reading order.

These characteristics make it possible for standard extraction approaches to produce incomplete, disordered, or noisy output.

### 8.4.2 Enhanced PDF Extraction Approach

To address these difficulties, KairosCV uses an enhanced PDF parsing flow rather than a single simplistic parser. The extraction logic attempts to recover text while also collecting useful context about the file, such as whether the document appears to contain multi-column or table-like structures.

This additional context helps the system interpret extraction quality more realistically. Instead of assuming that all PDFs behave the same way, the pipeline can treat structurally complex files with more caution.

### 8.4.3 Extraction Confidence in PDF Processing

The PDF parsing stage may also produce confidence-related metadata. This is useful because it allows later stages of the system to reason about whether the extracted text appears strong enough to trust directly or whether verification mechanisms should be emphasized more strongly.

## 8.5 DOCX Extraction Strategy

DOCX extraction is generally more straightforward than PDF extraction because DOCX files preserve more structured internal content. While the visual formatting of a DOCX file matters to the user, its underlying data representation usually makes textual recovery easier.

Our DOCX extraction strategy is based on converting the document into a form where meaningful structure can still be interpreted before the content is passed into the downstream extraction and AI stages.

### 8.5.1 Benefits of DOCX Handling

DOCX resumes offer several advantages during extraction:

1. More predictable content structure.
2. Better preservation of text blocks.
3. Cleaner handling of list-like content.
4. Reduced ambiguity compared to visually encoded PDF layouts.

Because of this, DOCX processing often provides a strong foundation for later structured extraction.

## 8.6 TXT Extraction Strategy

TXT extraction is the simplest of the supported input strategies. Since a text file already contains direct textual content, the system can read it without complex format-specific interpretation.

However, this simplicity also comes with limitations. A TXT resume may lack visual signals such as hierarchy, alignment, or bullet formatting. As a result, while the content is easy to read, some structural meaning may still need to be inferred later by the extraction pipeline.

This means that TXT handling is simple at the file-reading level but still depends on strong downstream interpretation.

## 8.7 OCR and Vision-Assisted Verification

One of the more advanced aspects of KairosCV is the inclusion of OCR or vision-assisted verification support for extraction quality. This is particularly useful for difficult PDF files where text-based parsing alone may not fully preserve the intended content.

The purpose of vision-assisted verification is not to replace the normal extraction path in every case. Instead, it acts as an additional support mechanism that can help:

1. Cross-check text extracted from the document.
2. Improve confidence in recovered content.
3. Detect situations where text extraction may have missed meaningful information.
4. Support better handling of visually complex layouts.

This design reflects our broader engineering approach: when a single method may not always be sufficient, the system benefits from layered verification rather than blind trust in the first result.

*Placeholder: Insert a diagram showing standard extraction combined with OCR or vision-based verification for complex resume files.*

## 8.8 Section Detection and Internal Structuring

After raw text is recovered, the system must begin identifying meaningful resume sections. This is an essential bridge between plain text extraction and structured resume generation.

The extraction pipeline attempts to recognize and organize content into areas such as:

1. Contact information.
2. Summary or objective.
3. Education.
4. Work experience.
5. Skills.
6. Projects.
7. Certifications.
8. Additional custom or optional sections.

Section detection is important because resumes are written for human reading, not for direct machine interpretation. The system must therefore infer structure from headings, patterns, position, and surrounding context.

## 8.9 Schema Mapping of Extracted Content

Once sections are detected conceptually, the extracted content must be mapped into the internal resume schema used throughout the application. This means converting raw or semi-structured information into a normalized representation that the rest of the system can work with consistently.

Schema mapping typically involves:

1. Assigning values to structured contact fields.
2. Creating separate entries for education and work experience.
3. Grouping skills into meaningful categories.
4. Preserving optional content without forcing it into incorrect fields.
5. Supporting custom sections where content does not fit standard categories.

This stage is significant because it defines how the system interprets the resume as data, not merely as text.

## 8.10 Handling Incomplete or Messy Resumes

In practice, many resumes are imperfect inputs. Some may omit standard headings. Others may combine multiple pieces of information in one line, use inconsistent formatting, or contain duplicated content. We therefore designed the extraction layer to tolerate imperfect inputs as much as possible.

The system attempts to manage such cases by:

1. Using flexible extraction logic rather than rigid templates.
2. Preserving unclassified content when necessary.
3. Applying verification checks to identify likely omissions.
4. Supporting fallback and normalization stages later in the pipeline.

This approach was important because a strict extractor might work only for ideal resumes, whereas a capstone project intended to solve a real problem must handle less controlled inputs.

## 8.11 Zero-Data-Loss Design Perspective

A major design principle behind the extraction internals was the idea of minimizing data loss. While it is difficult to guarantee perfect extraction under all conditions, our implementation aims to preserve as much user-provided information as possible.

This principle influenced several decisions:

1. Supporting multiple extraction strategies.
2. Including verification behavior rather than relying on a single pass.
3. Preserving custom or optional content instead of discarding it.
4. Carrying extraction results into later validation and cleanup stages.

From an evaluation perspective, this principle is important because it shows that the system is designed not only to produce polished output but also to respect the completeness of the original input.

## 8.12 Role of Extraction Internals in the Overall System

The parsing and extraction layer acts as the entry point into the intelligent part of the KairosCV pipeline. Without reliable extraction, later steps such as enhancement, validation, and rendering would lack trustworthy source material.

This makes the extraction internals one of the most critical technical foundations of the system. It is the stage where the application first begins to transform a user-uploaded document into a structured digital representation that can be meaningfully improved.

## 8.13 Chapter Summary

This chapter documented the parsing and extraction internals of KairosCV, including the strategies used for PDF, DOCX, and TXT files, the role of OCR or vision-assisted verification, the process of section detection and schema mapping, the handling of imperfect resumes, and the project’s emphasis on minimizing data loss. These internals form the technical foundation on which the later AI, validation, and output-generation stages depend.
# Chapter 9: AI Integration

## 9.1 Introduction

Artificial intelligence is a central part of the KairosCV system. While the project includes conventional software engineering components such as file handling, parsing, validation, storage, and PDF generation, these alone would not be sufficient to deliver meaningful resume optimization. AI is what allows the application to move beyond raw document conversion and into intelligent content interpretation and enhancement.

In this chapter, we document how AI is integrated into the system, why it is necessary, and which responsibilities it supports within the overall workflow.

## 9.2 Why AI Is Used in KairosCV

Resume optimization is not just a formatting task. It also involves understanding human-written content, identifying the role of different pieces of information, improving clarity, and expressing experience in a stronger professional style. Traditional rule-based systems are useful for structural tasks, but they are limited when it comes to language-sensitive improvement.

We used AI in KairosCV because it supports several needs that are difficult to address through static rules alone:

1. Interpreting resume content semantically.
2. Improving bullet-point phrasing.
3. Generating or refining summaries.
4. Categorizing skills more intelligently.
5. Supporting verification and classification of extracted content.
6. Tailoring output based on job-specific context.

This makes AI not a decorative addition, but a core functional layer in the application.

## 9.3 Position of AI Within the System

AI in KairosCV is integrated into the middle of the processing pipeline rather than placed only at the beginning or the end. This design is important because the system first needs to recover text and create a structured representation before AI can improve that content meaningfully.

The AI layer therefore operates after extraction has taken place but before final rendering. At this point, the system has enough information to apply enhancement, classification, and verification logic in a targeted way.

This positioning provides a practical balance:

1. Early stages handle raw technical extraction.
2. AI handles semantic understanding and improvement.
3. Later stages validate and render the result safely.

## 9.4 Primary and Fallback AI Strategy

One of the important design choices in KairosCV was not relying on only one AI interaction path for the entire application. Instead, the system includes a layered AI strategy in which different providers or services can support different parts of the workflow.

This strategy improves resilience in several ways:

1. It reduces dependency on a single service path.
2. It allows different AI modules to serve different purposes.
3. It supports fallback behavior if one model path is not ideal for a specific task.

From a system-design perspective, this makes the application more flexible and better suited for real-world deployment conditions.

## 9.5 AI for Structured Extraction Support

After raw text is recovered from the uploaded document, AI helps interpret that text as structured resume information. This is important because the same textual content can often be ambiguous without semantic understanding.

For example, the system must distinguish between:

1. A person’s name and a job title.
2. A company name and an institution name.
3. A technical skill and a project name.
4. A summary paragraph and a descriptive project section.

AI supports this stage by helping convert raw text into a more meaningful structured representation. This adds intelligence to the extraction process beyond what simple pattern matching can reliably achieve.

## 9.6 AI for Bullet-Point Enhancement

One of the most visible uses of AI in KairosCV is bullet-point enhancement. Many resumes contain bullets that are technically correct but weak in expression. They may be too vague, too generic, or lacking in strong action-oriented phrasing.

The system uses AI to improve such content by:

1. Rewriting bullets in a more professional tone.
2. Strengthening action verbs.
3. Improving clarity and readability.
4. Presenting responsibilities and outcomes more effectively.

While doing so, the intended goal is to preserve meaning rather than distort it. This distinction is important. The platform is meant to optimize existing content, not invent achievements or misrepresent the user’s experience.

*Placeholder: Insert a conceptual before-and-after bullet enhancement example, formatted as a report illustration rather than as a large code or prompt block.*

## 9.7 AI for Summary Generation

KairosCV also uses AI to generate or improve professional summaries. Many users either omit summaries entirely or include introductory text that is too broad, too weak, or insufficiently aligned with the rest of the resume.

AI-assisted summary generation helps the system:

1. Create a concise opening statement.
2. Reflect the user’s background more professionally.
3. Improve the overall readability of the final resume.
4. Give the document a stronger first impression.

This feature is particularly useful for students and early-career professionals, who may find it difficult to write strong summary sections on their own.

## 9.8 AI for Skill Categorization

Skills in resumes are often listed in inconsistent ways. Some users present all skills in a single line, while others mix programming languages, tools, databases, frameworks, and platforms together without categorization.

AI helps organize this information into meaningful skill groups, such as:

1. Languages
2. Frameworks
3. Tools
4. Databases

This improves the structure of the final output and makes the resume easier to interpret quickly. It also contributes to a cleaner and more professional presentation.

## 9.9 AI for Field Classification and Validation

In addition to content enhancement, AI also supports field-level classification and validation within the pipeline. This includes identifying whether a specific item has been placed in the correct category and whether ambiguous content should be interpreted differently.

This helps the system:

1. Detect likely field misplacements.
2. Improve the reliability of structured extraction.
3. Support correction of ambiguous values.
4. Increase confidence in the resulting schema mapping.

This is an important internal use of AI because it contributes to data quality even when the user never directly sees that intermediate reasoning.

## 9.10 AI for Verification and Completeness Checking

Another important role of AI in KairosCV is supporting verification. After a structured result is produced, the system can compare it conceptually against the raw text and assess whether meaningful content may have been omitted.

This contributes to:

1. Detection of possible gaps in extracted content.
2. Better awareness of extraction quality.
3. Support for additional passes or merge strategies where required.

This use of AI reflects a more careful engineering approach. Instead of assuming that the first structured output is perfect, the system uses semantic checking to question and refine that result.

## 9.11 Job-Description-Aware Tailoring

When the user provides a job description, AI can use that context to tailor aspects of the resume improvement process. This does not mean rewriting the entire resume arbitrarily. Rather, it means adjusting emphasis, phrasing, and presentation so that the output aligns more closely with the intended role.

This capability is useful because resumes are often more effective when they reflect the language and expectations of the target position. Context-aware optimization therefore adds practical value for users applying to specific jobs.

## 9.12 Responsible Use of AI in the System

While AI offers significant advantages, we also considered the need for controlled usage. Our intention was not to create a system that fabricates background information or replaces user identity with generated content. Instead, we designed KairosCV to use AI as an assistant for refinement, interpretation, and organization.

This means that the responsible use of AI in the project is based on:

1. Preserving user-provided meaning.
2. Improving clarity rather than inventing false content.
3. Supporting structure and professionalism.
4. Keeping AI inside a larger validated pipeline rather than treating it as the only source of truth.

This design perspective strengthens the credibility of the application.

## 9.13 AI Integration as an Engineering Decision

From a software engineering standpoint, integrating AI into KairosCV required more than simply calling an external model. AI outputs had to be placed within a broader technical workflow that includes validation, normalization, and output control.

This is an important point for evaluation because it shows that the project does not treat AI as a black-box replacement for system design. Instead, AI is one layer in a broader architecture that includes safeguards and supporting logic.

## 9.14 Chapter Summary

This chapter documented the integration of AI within KairosCV, including its role in structured extraction support, bullet-point enhancement, summary generation, skill categorization, field classification, completeness verification, and job-description-aware tailoring. The discussion also emphasized the responsible and controlled way in which AI is used within the system. Together, these capabilities make AI one of the most significant functional layers of the project.
# Chapter 10: Data Model and Validation

## 10.1 Introduction

The effectiveness of KairosCV depends not only on its ability to extract and enhance resume content, but also on its ability to represent that content in a consistent and reliable internal form. For this reason, the system uses a structured data model supported by validation logic. This chapter documents the internal resume schema, the major data sections used by the application, and the validation mechanisms that help preserve data integrity across the pipeline.

In our implementation, the data model acts as the bridge between raw extraction and final rendering. Without a strong intermediate representation, the system would struggle to maintain consistency across parsing, enhancement, storage, and PDF generation stages.

## 10.2 Purpose of the Internal Resume Model

The internal data model serves several important purposes within KairosCV:

1. It provides a consistent structure for resume content across different input formats.
2. It allows AI-enhanced and extracted information to be organized uniformly.
3. It supports validation before output generation.
4. It separates content representation from presentation.
5. It makes downstream rendering and storage more reliable.

This means that the data model is not merely a technical convenience. It is a central design element that allows the whole system to behave predictably.

## 10.3 Overall Structure of the Resume Schema

The schema used in KairosCV is designed to represent both common and optional resume sections. This was important because resumes vary significantly in content. Some users provide only basic education and experience, while others include projects, certifications, publications, awards, or custom sections.

The schema therefore includes core areas such as:

1. Contact information.
2. Summary.
3. Education.
4. Experience.
5. Skills.
6. Projects.
7. Certifications.

It also supports additional optional areas, making the model flexible enough for resumes of different complexity levels.

*Placeholder: Insert a schema overview diagram showing the major sections of the internal resume data model.*

## 10.4 Contact Information Structure

The contact section is one of the most important parts of the schema because it contains the user identity and communication details that must appear clearly in the final resume.

This section typically includes fields such as:

1. Name.
2. Email address.
3. Phone number.
4. LinkedIn profile.
5. GitHub profile.
6. Personal website.
7. Location.

By storing these as explicit fields rather than as unstructured text, the system can render them more consistently and validate them more effectively.

## 10.5 Education Structure

The education section is represented as a collection of education entries rather than as a single block of text. This allows the system to support multiple institutions, degrees, or academic milestones where applicable.

An education entry may include:

1. Institution name.
2. Degree.
3. Field of study.
4. GPA.
5. Honors.
6. Coursework.
7. Start or end dates.

Representing education this way improves formatting flexibility and supports more reliable rendering in the final template.

## 10.6 Experience Structure

The experience section is one of the most detailed and important areas of the resume schema. Each experience entry is typically represented as a structured object containing:

1. Job title.
2. Company name.
3. Location.
4. Start date.
5. End date.
6. Bullet points or descriptions.

This structure is essential because work experience is usually the main area where AI enhancement is applied. The system needs clearly separated entries and bullets in order to improve them effectively without damaging context.

## 10.7 Skills Structure

Instead of storing all skills as a single flat list, KairosCV organizes them into categories. This contributes to a more professional presentation and allows the final resume to display skills in a cleaner format.

The skill model may include categories such as:

1. Languages.
2. Frameworks.
3. Tools.
4. Databases.

This organization reflects one of the broader principles of the project: the system should not only preserve resume content, but also present it in a more readable and meaningful structure.

## 10.8 Projects Structure

Project entries are especially important for students and early-career users. The schema therefore supports multiple project records, each of which may include:

1. Project name.
2. Description.
3. Technologies used.
4. Bullet points.
5. Links where relevant.

This allows the application to preserve project detail while still formatting it in a consistent and professional way.

## 10.9 Optional and Extended Sections

Since resumes are not limited to a fixed set of sections, the schema also supports optional areas. These may include:

1. Certifications.
2. Awards.
3. Publications.
4. Volunteer work.
5. Language proficiency.
6. Hobbies.
7. References.
8. Custom sections.

The inclusion of these optional structures is important because it helps prevent information loss when users provide content that does not fit a minimal traditional resume template.

## 10.10 Need for Validation

Once extraction and enhancement generate structured data, the system still needs a reliable way to confirm that the data is usable. This is where validation becomes essential.

Validation helps the project in several ways:

1. It checks whether required structural elements are present.
2. It reduces the risk of malformed data reaching the rendering stage.
3. It makes the system more predictable across different input qualities.
4. It supports fallback behavior when data is incomplete.

For a project like KairosCV, validation is not optional. It is a necessary control layer that protects the rest of the workflow.

## 10.11 Validation with Zod

KairosCV uses schema-based validation to enforce structure on the internal resume representation. This allows the system to test whether the processed data matches expected shapes before it is used for final output generation.

The use of Zod was useful because it provided:

1. Clear structural constraints.
2. Safer handling of nested objects and arrays.
3. A more disciplined approach to runtime validation.
4. Better support for error-aware fallback behavior.

This improves confidence in the correctness of the data being passed through the later stages of the system.

## 10.12 Default Filling and Fallback Behavior

Not all extracted resumes produce perfectly complete structured results. In some cases, certain required fields may be missing or incomplete. To improve resilience, KairosCV includes fallback behavior that can fill defaults where necessary.

This does not replace strong extraction, but it helps prevent total pipeline failure in cases where minor gaps remain. It also supports continuity in the workflow, especially when a field is required structurally but not critical semantically.

This stage reflects a practical engineering decision: it is often better to recover gracefully than to fail completely because of a limited missing value.

## 10.13 Confidence Scoring Logic

Validation in KairosCV is complemented by confidence scoring. While validation answers the question of whether the data is structurally acceptable, confidence scoring helps assess how complete or strong the resulting content appears.

This scoring logic can take into account:

1. Presence or absence of important sections.
2. Apparent completeness of contact information.
3. Strength of experience and education representation.
4. Availability of structured skills and projects.

This added evaluation layer gives the system a better understanding of the quality of its own output.

## 10.14 Data Model as a Link Between Processing and Rendering

One of the most important reasons for maintaining a strong data model is that it allows the system to decouple extraction from presentation. The parsers and AI services do not need to know the visual details of the final resume templates. They only need to produce a valid internal representation.

The rendering layer can then take that validated data and map it into the chosen template. This separation of concerns improves maintainability and makes the system easier to extend.

## 10.15 Chapter Summary

This chapter documented the internal data model and validation approach used in KairosCV. We explained the purpose of the resume schema, described the major structured sections such as contact details, education, experience, skills, projects, and optional areas, and discussed the role of validation, fallback behavior, and confidence scoring. Together, these mechanisms help ensure that the resume data flowing through the system is consistent, reliable, and suitable for final rendering.
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
# Phase 5: Quality, Deployment, and Final Evaluation

## Contents

1. Security and Reliability
   - File type and signature validation
   - File size limits
   - Safe file identifiers
   - Access control
   - Error handling and fallback strategies
   - Privacy considerations

2. Testing Strategy
   - Unit tests present in the project
   - Parser and template testing
   - Validation testing
   - Suggested integration tests
   - Known testing gaps

3. Deployment and Environment Setup
   - Local setup
   - Environment variables
   - Render deployment
   - Vercel deployment
   - Production requirements for Puppeteer/Chromium
   - Supabase production setup

4. Challenges Faced and Solutions
   - Resume parsing complexity
   - Multi-format support
   - Maintaining one-page PDF output
   - AI extraction reliability
   - Storage and auth flexibility

5. Limitations
   - Current technical limitations
   - Known edge cases
   - Model dependency limitations
   - Performance considerations

6. Future Enhancements
   - Better personalization
   - More templates
   - Stronger analytics and scoring
   - Enhanced recruiter/ATS matching
   - Broader file and language support

7. Conclusion
   - Summary of outcomes
   - Capstone significance
   - Final remarks

8. Appendices
   - Folder structure
   - Important modules and files
   - Sample environment configuration
   - Sample processing flow
   - References
# Chapter 16: Security and Reliability

## 16.1 Introduction

Security and reliability are essential quality dimensions of KairosCV because the application processes user-uploaded documents containing personal and professional information. A resume typically includes sensitive details such as name, email address, phone number, location, education history, work experience, project records, and technical skills. For this reason, the application cannot be evaluated only in terms of functional correctness. It must also be examined in terms of how safely and reliably it handles input, processing, access, and output delivery.

In this chapter, we document the key security and reliability measures incorporated into the system. These include input validation, file integrity checks, safe identifier generation, access control, fallback handling, privacy-conscious cleanup, and general reliability strategies that support dependable operation across the workflow.

## 16.2 Importance of Security in a Resume Processing Platform

KairosCV operates in a domain where user trust is especially important. Unlike a purely public information system, this platform receives personal career documents and transforms them through a multi-stage backend process. Any weakness in input handling, file access, or output delivery could affect privacy, data integrity, or system stability.

From our perspective, security in this project is important for several reasons:

1. Users submit personal documents containing identifiable information.
2. Uploaded content must be handled safely before processing begins.
3. Generated outputs must not be exposed to unauthorized users.
4. The backend must resist malformed or suspicious file submissions.
5. Session-aware routes must protect account-linked resources.

Thus, security is not an isolated feature but a cross-cutting concern that affects the entire platform.

## 16.3 File Type Validation

One of the first security-oriented decisions in KairosCV is strict validation of supported input formats. The system is designed to accept only a defined set of file types that are expected within the resume-processing context, namely PDF, DOCX, and TXT.

This restriction is important because it narrows the attack surface of the upload pipeline. Allowing arbitrary file types would increase the risk of invalid input, unexpected parser behavior, and storage misuse. By explicitly restricting accepted document formats, the system reduces ambiguity at the very first stage of interaction.

File type validation also contributes to reliability. It ensures that downstream parsing logic only receives content types for which the system has dedicated extraction strategies.

## 16.4 File Signature Verification

In addition to checking extensions and MIME types, KairosCV also validates the file signature of uploaded content. This is an important measure because relying only on the file name or browser-reported type would not be sufficient for trustworthy validation.

File signature verification helps determine whether the internal content of the file matches the claimed format. This improves confidence that:

1. A PDF upload is actually a PDF.
2. A DOCX upload is actually a valid Word-based document structure.
3. A TXT upload is not simply another file disguised with a different extension.

From a security perspective, this is valuable because it prevents superficial spoofing of file type. From a reliability perspective, it reduces the likelihood that an unsupported or malformed file reaches the parsing layer and causes failure.

## 16.5 File Size Constraints

KairosCV applies file size limits to uploaded resumes. This is a practical and important control because it protects the system from unusually large files that could consume excessive resources or fall outside the intended use case.

The file size limit contributes to the platform in the following ways:

1. It helps control memory and processing costs.
2. It reduces the risk of denial-of-service-like stress from oversized uploads.
3. It improves predictability in parsing and PDF generation behavior.
4. It aligns the application with the expected size of a normal resume document.

By limiting file size early, the application avoids wasting resources on inputs that are likely inappropriate for the platform’s purpose.

## 16.6 Safe File Identifiers

The system does not rely on user-provided filenames as primary internal identifiers. Instead, it generates secure identifiers for uploaded files and uses them to track the file through the processing lifecycle.

This is an important security and design choice because it:

1. Reduces exposure of user-controlled naming data.
2. Avoids identifier collisions.
3. Makes storage and retrieval more predictable.
4. Improves isolation between user uploads.

By separating user-facing filenames from internal object tracking, the application gains better control over file references and route behavior.

## 16.7 Access Control as a Security Mechanism

Authentication and access control contribute directly to the security posture of KairosCV. Since the application stores or exposes user-linked resume history and profile-related information, the system must ensure that protected content is not made available to unauthorized users.

Access control supports:

1. Restriction of dashboard access.
2. Restriction of settings access.
3. Protection of account-specific resume history.
4. Prevention of unauthorized download access where user-linked content is involved.

This means that security in KairosCV is not limited to file validation alone. It also includes ongoing control over who is allowed to view and retrieve stored artifacts.

## 16.8 Privacy Considerations in Resume Handling

Resumes are highly personal documents. They often include educational background, employment history, project details, contact information, and sometimes links to external personal profiles. Because of this, privacy handling is a major concern in any system that processes resumes.

In KairosCV, privacy is supported through a combination of design choices:

1. Controlled file handling.
2. User-aware access where authentication is enabled.
3. Cleanup support for unnecessary intermediate artifacts.
4. Separation between upload input, metadata, and output retrieval paths.

Our aim was not only to make the system functional, but also to ensure that personal documents are treated with appropriate care throughout the workflow.

## 16.9 Reliability Through Staged Processing

Reliability in KairosCV is strongly influenced by the fact that the system is designed as a staged pipeline rather than a single monolithic transformation. This design helps isolate failure points and makes the system easier to reason about under imperfect conditions.

The staged architecture improves reliability because:

1. Each stage has a clear responsibility.
2. Failures can be localized more easily.
3. Progress can be monitored more transparently.
4. Intermediate validation is possible before final output is generated.

This structure also makes the application more robust during evaluation, because the behavior of the system can be examined stage by stage.

## 16.10 Error Handling and Failure Awareness

No practical system should assume that all inputs, all services, and all environments will behave perfectly. For this reason, KairosCV includes error-handling paths across several important parts of the workflow.

Examples of failure-aware design include:

1. Rejection of invalid uploads before parsing begins.
2. Fallback behavior when extraction or enhancement does not proceed ideally.
3. Controlled handling of missing or incomplete structured data.
4. Explicit processing error reporting through the progress communication layer.
5. Graceful output failure responses when final retrieval cannot be completed.

From a reliability standpoint, this is important because it prevents the application from collapsing silently or producing misleading behavior when problems arise.

## 16.11 Fallback Strategies

The system includes multiple fallback-oriented decisions that improve resilience. These do not eliminate all possible failure conditions, but they make the system better able to continue operating under imperfect circumstances.

Examples of such strategies include:

1. Multi-format-specific parsing paths rather than one generic parser.
2. Additional verification support for complex extraction cases.
3. Default-filling behavior when some structured fields are incomplete.
4. Multi-stage validation before output generation.

These strategies reflect an important principle in our development approach: reliable systems should not depend entirely on ideal inputs or single-path success.

## 16.12 Reliability of Output Delivery

Reliability in KairosCV also extends to the final stage of user interaction, namely the retrieval of the optimized resume. It is not enough to process a file successfully if the final output cannot be delivered consistently.

Output reliability depends on:

1. Correct association between generated files and their identifiers.
2. Stable storage references.
3. Controlled retrieval behavior through download routes.
4. Clear communication to the frontend when output is ready.

This is especially important because, from the user’s perspective, the generated PDF is the primary value produced by the system.

## 16.13 Operational Hygiene and Cleanup

Another element of reliability is responsible cleanup and artifact lifecycle management. If uploaded files and temporary artifacts accumulate without control, the system may become harder to manage over time and may retain more sensitive data than necessary.

The inclusion of cleanup-related logic reflects awareness that:

1. Intermediate artifacts should not always persist indefinitely.
2. Temporary processing data may need to be removed after use.
3. Retention decisions affect both privacy and operational maintainability.

This contributes to a more disciplined and deployment-aware system design.

## 16.14 Security and Reliability as Evaluation Criteria

In a capstone project, functionality alone is not sufficient to demonstrate maturity. Evaluators also consider whether the project reflects awareness of operational and engineering quality concerns. Security and reliability are therefore important not only in practice but also in how the project is academically assessed.

By incorporating validation, controlled access, file integrity checks, fallback strategies, and privacy-conscious behavior, we demonstrate that KairosCV was developed with a broader understanding of software quality rather than only feature implementation.

## 16.15 Scope and Limits of the Current Security Model

Although KairosCV includes several practical security and reliability measures, it should also be acknowledged that no student capstone system can claim exhaustive enterprise-grade protection across all dimensions. The present implementation is best understood as a well-considered academic and functional platform with meaningful safeguards, rather than a complete security product.

This balanced view is important because it reflects responsible documentation. A strong report should identify both what has been implemented and what further hardening would be possible in larger-scale production scenarios.

## 16.16 Chapter Summary

This chapter documented the security and reliability foundations of KairosCV, including file type validation, signature verification, file size control, secure identifiers, access control, privacy-aware document handling, staged reliability design, error and fallback handling, output reliability, and cleanup behavior. Together, these measures strengthen the credibility, safety, and operational maturity of the system and contribute significantly to its quality as a capstone project.
# Chapter 17: Testing Strategy

## 17.1 Introduction

Testing is an essential part of software quality assurance, especially in a project like KairosCV where the system performs multi-stage transformations on user-provided documents. Since the application combines file validation, parsing, structured extraction, AI-assisted enhancement, schema validation, storage, and PDF generation, a defect in one layer can affect the usefulness of the final result. For this reason, testing was an important part of our engineering approach.

In this chapter, we document the testing strategy followed in KairosCV, the types of tests present in the project, the areas that benefit most from verification, and the testing gaps that remain relevant for future improvement.

## 17.2 Importance of Testing in KairosCV

The need for testing in this project is especially strong because the system is not performing a single deterministic calculation. It is instead coordinating multiple stages, each of which can introduce failure if not handled carefully.

Testing is important here because:

1. File parsing behavior must be validated across formats.
2. Template rendering must remain structurally correct.
3. Schema validation logic must behave predictably.
4. Cleanup and edge-case handling must not damage valid data.
5. Changes in one module may affect later stages of the pipeline.

Thus, testing in KairosCV is not merely a formality. It is one of the main ways in which we improve confidence in the system’s correctness and maintainability.

## 17.3 Testing Philosophy

Our testing philosophy for KairosCV was based on verifying the modules that are most important to correctness, transformation quality, and stability. Since this is a capstone project with a meaningful but bounded scope, the testing approach focuses primarily on the areas where logic is complex, reusable, and likely to affect the end-to-end pipeline significantly.

This includes:

1. Parsing logic.
2. Template rendering behavior.
3. Validation behavior.
4. Edge-case handling.

The goal was not to create superficial test counts, but to place testing effort where it would provide the most useful assurance.

## 17.4 Unit Testing as the Primary Strategy

The project includes unit-oriented testing for selected backend modules. Unit testing is appropriate for KairosCV because many important operations can be isolated and checked independently of the full application runtime.

This is useful because unit tests:

1. Help verify focused logic in reusable modules.
2. Make regression detection easier during future edits.
3. Reduce the need to manually re-check every behavior after small changes.
4. Support clearer debugging when a particular transformation fails.

Unit testing is therefore a practical strategy for a modular application like KairosCV.

## 17.5 Parser Testing

One of the most important testing areas in the project is parser behavior. Since the entire optimization workflow depends on successful extraction of resume content, problems in parsing would affect all later stages.

Parser-related testing is important because it helps verify:

1. That structured extraction behaves predictably.
2. That edge cases are handled more safely.
3. That later stages receive reasonable input.

Testing parser behavior is particularly valuable because extraction logic must cope with varying document structures. Even though no test suite can represent all possible resume layouts, focused parser tests can still provide meaningful confidence in important scenarios.

## 17.6 Edge-Case Handling Tests

KairosCV includes logic for handling difficult or irregular content scenarios. Testing these behaviors is important because real resumes are not always neat, complete, or consistently formatted.

Edge-case-related tests are useful for confirming that:

1. Duplicates are removed appropriately.
2. Incomplete structures are stabilized effectively.
3. Cleanup logic does not accidentally damage valid content.

These tests are significant from an evaluation perspective because they show awareness of real-world document variability rather than only ideal sample inputs.

## 17.7 Template Rendering Tests

The final output quality of KairosCV depends not only on extraction and enhancement, but also on how the structured data is rendered into a resume template. Template rendering tests help verify that transformed resume data is inserted into templates correctly and consistently.

This testing area is valuable because it can reveal:

1. Broken layout assumptions.
2. Missing field handling problems.
3. Incorrect conditional display of optional sections.
4. Output inconsistencies introduced by rendering changes.

By testing template-rendering logic, we strengthen confidence that the final output remains coherent as the project evolves.

## 17.8 Validation Testing

Validation-related testing is another critical part of the strategy. Since the application depends on a formal internal data model, it is important to confirm that valid data passes appropriately and that missing or malformed structures are handled in a predictable way.

Validation tests help ensure:

1. The schema behaves as intended.
2. Fallback logic activates when necessary.
3. Required fields are enforced correctly.
4. Data integrity remains stable before rendering.

This contributes directly to the reliability of the resume generation pipeline.

## 17.9 Why Automated Testing Is Important for Maintainability

Automated tests are particularly useful in a project like KairosCV because the system contains interconnected modules. A change made in the extraction layer, validation layer, or template-rendering logic may unintentionally alter behavior elsewhere.

Tests improve maintainability by:

1. Detecting regressions early.
2. Supporting safer refactoring.
3. Providing repeatable checks across iterations.
4. Reducing dependency on fully manual verification.

This makes automated testing valuable not only during initial development, but also for long-term project sustainability.

## 17.10 Manual Testing and Functional Verification

In addition to automated testing, manual testing also plays an important role in a project like KairosCV. Some aspects of the application, such as user interaction flow, visual output quality, and subjective usefulness of generated content, are not fully captured by unit tests alone.

Manual verification is useful for assessing:

1. Upload workflow behavior.
2. Progress tracking experience.
3. Final PDF usability and visual quality.
4. Dashboard and settings interactions.
5. General consistency of the end-to-end workflow.

This means that the project benefits from a hybrid testing mindset rather than relying solely on one testing mode.

*Placeholder: Insert a table or screenshot placeholder showing example test categories such as parser tests, rendering tests, validation tests, and manual workflow checks.*

## 17.11 Suggested Integration Tests

Although the project includes important module-level tests, a broader testing strategy for future work would benefit from more integration-oriented coverage. Integration testing would be useful for verifying how multiple modules behave together across realistic workflows.

Examples of useful future integration tests include:

1. Upload-to-download workflow validation.
2. File-type-specific end-to-end processing checks.
3. Authenticated user history persistence checks.
4. Output generation under different template selections.
5. Failure-path handling when one processing stage does not complete normally.

These tests would strengthen the project further by covering interaction between layers rather than only isolated module behavior.

## 17.12 Suggested User Interface Testing

Another future testing direction would be more explicit UI-level verification. Since the frontend contains important dynamic behavior, such as progress tracking and result-state transitions, targeted interface tests could be beneficial.

Possible frontend testing areas include:

1. File selection and validation messaging.
2. Template selection interaction.
3. Progress tracker updates based on streamed events.
4. Result state transitions after processing completion.
5. Dashboard rendering for different account states.

This would improve confidence in the user-facing behavior of the application.

## 17.13 Known Testing Gaps

As with most capstone projects, the current testing strategy is strong in some areas and still incomplete in others. It is important to document these limitations honestly.

Potential testing gaps include:

1. Limited full end-to-end workflow automation.
2. Dependence on real or variable AI-related behavior for some quality-sensitive stages.
3. The difficulty of exhaustively testing all possible resume layouts.
4. Limited automated UI coverage.
5. The challenge of testing output quality in a purely objective way.

Identifying these gaps is important because it shows evaluators that we understand the difference between partial and comprehensive testing maturity.

## 17.14 Testing Challenges Specific to This Project

Testing a system like KairosCV is inherently more complex than testing a purely deterministic data-processing application. This is because:

1. Input documents vary widely in structure.
2. Some processing quality depends on external AI behavior.
3. Final output quality is partly structural and partly subjective.
4. The application contains both backend-heavy and UI-heavy elements.

These characteristics make testing a multidimensional challenge. Our testing strategy should therefore be understood as a meaningful but evolving quality layer rather than a final exhaustive guarantee.

## 17.15 Evaluation Perspective

From an academic perspective, the testing strategy contributes significantly to the credibility of the project. A capstone application that handles resume parsing, enhancement, and generation should not rely only on demonstration output. It should also show evidence of methodical verification.

By including automated tests in important modules and by recognizing the role of manual and future integration testing, we demonstrate a balanced and practical engineering mindset.

## 17.16 Chapter Summary

This chapter documented the testing strategy of KairosCV, including the importance of testing in the project, the use of unit tests for parsing, edge-case handling, validation, and template rendering, the role of manual workflow verification, and the opportunities for future integration and UI testing. It also acknowledged current testing gaps and project-specific testing challenges. Together, these observations show that quality assurance was treated as a meaningful part of the development process.
# Chapter 18: Deployment and Environment Setup

## 18.1 Introduction

Deployment readiness is an important indicator of project maturity. A system that works only in a narrowly controlled development environment is less convincing than one that can be configured, executed, and evaluated in conditions closer to real use. For this reason, KairosCV was designed with both development setup and deployment considerations in mind.

In this chapter, we document the environment requirements of the application, the role of configuration management, and the deployment paths considered in the project. We also describe the importance of browser-based PDF generation support and cloud-related dependencies that influence production execution.

## 18.2 Importance of Deployment Planning

Deployment planning was important in this project for several reasons:

1. The application depends on multiple services and runtime settings.
2. Resume processing includes server-side PDF generation.
3. Authentication and storage behavior depend on environment configuration.
4. AI-assisted stages require valid provider credentials.
5. Evaluators may judge maturity partly through deployment awareness.

By incorporating deployment thinking into the project, we treated KairosCV as a realistic application rather than only a code-level prototype.

## 18.3 Local Development Setup

The first deployment context for KairosCV is local development. Local setup is important because it allows the application to be developed, tested, and demonstrated without requiring immediate full production infrastructure.

The local environment supports:

1. Running the Next.js application.
2. Testing upload and processing workflows.
3. Using local storage where needed.
4. Enabling or disabling account-related features depending on setup.
5. Verifying the frontend and backend integration during development.

This development-friendly mode was important because it allowed us to build and refine the system iteratively while still preserving production-style architectural patterns.

## 18.4 Configuration Through Environment Variables

KairosCV relies on environment variables to configure many important aspects of behavior. This is a standard and practical design choice because it separates deployment-specific values from the application source code.

Environment configuration in the project is important for:

1. AI service credentials.
2. Authentication and Supabase setup.
3. Storage mode selection.
4. Trial limiting behavior.
5. File processing settings.
6. PDF generation configuration.

Using environment-driven configuration improves flexibility and makes the system easier to adapt across development, testing, and hosted environments.

## 18.5 AI Service Configuration

Since KairosCV integrates AI into the processing pipeline, deployment requires valid configuration for the relevant AI providers. The application depends on these credentials to perform content enhancement, structured extraction support, or verification-oriented tasks depending on the processing stage.

This means that environment setup is not merely a technical requirement. It directly affects whether the central intelligence layer of the platform can operate as intended.

Reliable AI configuration is therefore a critical deployment prerequisite.

## 18.6 Authentication and Supabase Configuration

When authentication and cloud-backed persistence are enabled, Supabase configuration becomes an essential part of environment setup. This includes values related to:

1. Supabase project access.
2. Public client integration.
3. Service-role access where appropriate.
4. Bucket or storage configuration.

This environment dependency is important because it controls whether the account-aware aspects of the system, such as login, profile access, and user-linked resume history, function correctly.

## 18.7 Storage Configuration

The deployment model of KairosCV also depends on how storage is configured. The application can operate in local storage mode or in a Supabase-backed storage mode, depending on environment settings.

This flexibility is beneficial because:

1. It supports development without requiring full cloud provisioning.
2. It supports more persistent and production-oriented operation when needed.
3. It allows deployment to be adapted according to evaluation or hosting requirements.

Storage configuration is therefore a major operational decision in the environment setup process.

## 18.8 PDF Generation Requirements

One of the more technically sensitive parts of deployment is server-side PDF generation. KairosCV depends on browser-based rendering support in order to generate the final resume output consistently.

This introduces deployment requirements such as:

1. Availability of a compatible Chromium or browser runtime.
2. Correct configuration of executable or hosted binary paths where needed.
3. Awareness of platform-specific runtime limitations.

Because the final PDF is one of the main outputs of the application, deployment must account for this layer carefully. A successful deployment is not only one in which the server starts, but one in which the complete processing and rendering pipeline can execute correctly.

## 18.9 Render Deployment Considerations

Render is one of the deployment-oriented environments considered in the project. Using such a platform is useful because it supports a hosted execution model while still allowing the application to behave much like a conventional web backend.

Render-related deployment considerations include:

1. Build and start configuration.
2. Runtime environment variables.
3. Support for browser-based PDF dependencies.
4. General server-side operation of the Next.js application.

This reflects the project’s aim to be deployable in a realistic web-hosting context.

## 18.10 Vercel Deployment Considerations

Vercel is another important deployment path because it is closely aligned with Next.js applications. However, cloud deployment through such a platform may require extra care for PDF generation and runtime packaging.

Important Vercel-related considerations include:

1. Runtime compatibility.
2. Browser-binary handling for PDF generation.
3. Environment variable availability.
4. Service integration configuration.

This is especially relevant because a deployment platform may support the framework well overall while still requiring additional setup for specialized backend tasks such as document rendering.

## 18.11 Production Readiness Considerations

A production-capable setup for KairosCV requires more than simply starting the server. It also requires that the broader environment support:

1. Valid AI integrations.
2. Stable storage behavior.
3. Working authentication where enabled.
4. Reliable PDF generation.
5. Proper handling of file uploads and downloads.

This means that deployment readiness should be evaluated across the full application workflow and not only at the route-loading level.

## 18.12 Environment-Specific Trade-Offs

Different deployment environments may offer different advantages and constraints. For example:

1. Local environments are easier for rapid iteration.
2. Cloud-backed environments are stronger for persistence and realism.
3. Some platforms simplify frontend deployment but complicate browser-based PDF execution.
4. Different storage setups trade convenience against production persistence.

Recognizing these trade-offs is important because it demonstrates that deployment planning involves system-level reasoning rather than only a platform choice.

## 18.13 Deployment as Part of Capstone Maturity

From a capstone evaluation standpoint, deployment awareness is a meaningful sign of project maturity. A well-documented deployment model shows that the team considered not only implementation but also execution context, service dependencies, environment configuration, and operational feasibility.

This strengthens the project by demonstrating that it was developed with realistic software delivery in mind.

*Placeholder: Insert an environment and deployment architecture diagram showing local development, cloud configuration, storage integration, AI services, and PDF-generation dependencies.*

## 18.14 Practical Challenges in Deployment

Deployment of KairosCV is more complex than deploying a basic content-driven web application. This is because the system includes:

1. File handling.
2. AI integrations.
3. Session-aware behavior.
4. Browser-assisted PDF generation.
5. Optional cloud-backed storage.

These dependencies increase the need for careful configuration and testing across environments. Documenting this clearly is important because it shows that we understand the practical demands of running the system outside the development machine.

## 18.15 Chapter Summary

This chapter documented the deployment and environment setup considerations of KairosCV, including local development support, environment variable configuration, AI and Supabase setup, storage mode selection, PDF generation requirements, and hosting considerations for platforms such as Render and Vercel. Together, these deployment concerns show that the project was designed with realistic runtime operation and evaluation-ready execution in mind.
# Chapter 19: Challenges Faced and Solutions

## 19.1 Introduction

Like most substantial software projects, KairosCV was not developed without technical and design challenges. The problem addressed by the platform appears simple at a high level, but the implementation required solving multiple interconnected issues involving file parsing, AI-assisted interpretation, structured validation, PDF rendering, storage, and account-based behavior.

In this chapter, we document the major challenges we faced during the development of the system and explain the solutions or design decisions through which we addressed them. This discussion is important in a capstone evaluation because it highlights not only the final result, but also the engineering reasoning behind the project.

## 19.2 Challenge of Resume Parsing Complexity

One of the first major challenges was the inherent complexity of resume documents themselves. Resumes are not standardized input files. They may differ in structure, formatting, spacing, ordering, section names, and visual layout.

This created several problems:

1. Some resumes follow traditional linear layouts.
2. Others use multi-column structures.
3. Different users label similar sections with different headings.
4. Content may be compressed into short lines or irregular bullet groupings.
5. Important information may not appear in a predictable position.

### 19.2.1 Solution Adopted

To address this, we designed the system with format-specific parsing strategies and a staged extraction model rather than depending on one universal parsing rule. We also included support for verification-oriented behavior and structured schema mapping so that the application could move gradually from raw content to usable internal data.

This solution reduced the risk of overfitting the project to a single document style.

## 19.3 Challenge of Supporting Multiple File Formats

Supporting PDF, DOCX, and TXT uploads introduced another challenge. Each format behaves differently internally, and each one requires distinct handling.

For example:

1. PDFs are visually oriented and often difficult to parse reliably.
2. DOCX files preserve more structure but still require conversion support.
3. TXT files are easy to read but can lack clear formatting cues.

### 19.3.1 Solution Adopted

We addressed this challenge by introducing dedicated parsing paths for each supported file type. Rather than forcing every format through the same low-level logic, the application identifies the file type and applies the extraction strategy best suited to that format.

This approach improved both maintainability and extraction quality.

## 19.4 Challenge of Extracting Information Without Losing Content

Another important challenge was preserving as much resume content as possible during extraction. If the system misses sections, merges unrelated content, or discards optional material, the quality of the final output can be reduced significantly.

### 19.4.1 Solution Adopted

Our response to this challenge was to design the pipeline around a low-data-loss perspective. We supported:

1. Structured extraction beyond simple plain-text recovery.
2. Verification and completeness checking.
3. Optional and custom sections within the internal schema.
4. Cleanup and validation stages after extraction.

This ensured that the application treated content preservation as a central goal rather than a secondary concern.

## 19.5 Challenge of AI Reliability

AI adds substantial value to the platform, but it also introduces uncertainty. Model-assisted operations can vary in quality, and there is always a risk that AI-generated text might become too generic, too aggressive in rewriting, or insufficiently aligned with the original content.

### 19.5.1 Solution Adopted

We addressed this by placing AI inside a broader validated system rather than allowing it to operate without control. The AI layer in KairosCV is supported by:

1. Structured input context.
2. Validation and cleanup stages after enhancement.
3. A broader pipeline that preserves user-provided information.
4. A design philosophy focused on optimization rather than invention.

This helped us use AI as a controlled enhancement tool rather than as the sole authority over resume content.

## 19.6 Challenge of Maintaining One-Page Output

Producing a strong one-page resume output was another significant challenge. Even when extraction and enhancement work correctly, fitting the content onto a single professionally readable page is not trivial.

This issue becomes more difficult when:

1. The source resume is already long.
2. The user includes multiple projects or experience entries.
3. Different templates allocate space differently.
4. The final visual output must still remain readable.

### 19.6.1 Solution Adopted

We addressed this challenge by separating structured content from final rendering and using server-side PDF generation through template-based layouts. This gave the project stronger control over spacing, formatting, and final output constraints than a less controlled export strategy would have allowed.

This decision was important because it allowed us to manage the final output more precisely.

## 19.7 Challenge of Real-Time Feedback During Processing

Since resume optimization involves multiple backend stages, another challenge was ensuring that users remained informed during processing rather than facing an opaque waiting experience.

### 19.7.1 Solution Adopted

We solved this by adding a streaming progress mechanism that communicates stage-level updates to the frontend. This improved the user experience and also made the internal workflow more transparent.

From an engineering standpoint, this solution was valuable because it aligned user feedback with the real structure of the backend pipeline.

## 19.8 Challenge of Storage Flexibility

The project needed to support realistic persistence while still remaining easy to develop and test. Relying only on local storage would limit deployment realism, while relying only on cloud-backed storage would increase development dependency and setup overhead.

### 19.8.1 Solution Adopted

We addressed this by supporting both local and Supabase-backed storage. This gave us flexibility across environments and allowed the same processing logic to function under different persistence configurations.

This solution improved the practicality of both development and deployment.

## 19.9 Challenge of Authentication Integration

Adding authentication introduced another layer of complexity. The project needed to support user-linked access to dashboards, profile information, and resume history while still allowing development-friendly workflows.

### 19.9.1 Solution Adopted

We integrated authentication through Supabase and route-aware protection while also supporting configuration-based bypass behavior for local development. This allowed the system to maintain realistic access control without making implementation unnecessarily rigid during early development.

This was a useful compromise between platform completeness and development convenience.

## 19.10 Challenge of Balancing Complexity and Usability

KairosCV performs a technically complex set of tasks, but the interface needed to remain simple from the user’s perspective. This created a design challenge: how to hide internal complexity without oversimplifying important user decisions such as template choice, job context, and result retrieval.

### 19.10.1 Solution Adopted

We addressed this by organizing the interface around a guided flow:

1. Upload a file.
2. Optionally provide job context.
3. Choose output preferences.
4. View real-time progress.
5. Download the result.

This kept the interface manageable while still exposing the options that matter.

## 19.11 Challenge of Validation and Data Consistency

Once extracted and enhanced data begins to move through the system, maintaining structural consistency becomes a challenge. Missing fields, duplicated content, or misclassified entries can damage the final output even if the earlier stages appear successful.

### 19.11.1 Solution Adopted

We addressed this by using:

1. A defined internal schema.
2. Validation checks.
3. Cleanup and normalization logic.
4. Fallback/default handling where appropriate.

This gave the project a stronger internal contract between extraction and rendering.

## 19.12 Challenge of Capstone Scope Management

Another non-trivial challenge was deciding how broad the project should become. Resume optimization touches many possible feature areas, including analytics, recruiter-facing insights, advanced user customization, and broader career-platform behavior.

### 19.12.1 Solution Adopted

We addressed this challenge by maintaining a focused scope. We concentrated on the full pipeline from upload to optimized PDF generation and supporting user account workflows, rather than expanding into unrelated hiring-platform features.

This focus helped ensure that the final system remained technically rich but realistically completable as a capstone project.

## 19.13 Value of These Challenges in the Project Narrative

From an academic perspective, the challenges documented here are important because they demonstrate that the project required more than surface-level feature assembly. The team had to make architectural choices, evaluate trade-offs, and solve practical problems across multiple layers of the stack.

This strengthens the report because it shows evidence of engineering judgment rather than only implementation effort.

## 19.14 Chapter Summary

This chapter documented the major challenges faced during the development of KairosCV, including parsing complexity, multi-format support, low-data-loss extraction, AI reliability, one-page PDF generation, real-time progress communication, storage flexibility, authentication integration, usability balance, validation consistency, and scope control. It also described the solutions adopted to address each of these issues. Together, these discussions illustrate the problem-solving process that shaped the final system.
# Chapter 20: Limitations

## 20.1 Introduction

No software system is without limitations, and documenting those limitations is an important part of a professional academic report. A strong capstone evaluation should not only highlight successful outcomes but also acknowledge the current boundaries of the implementation. This reflects technical honesty and a mature understanding of the difference between a capable system and a fully exhaustive one.

In this chapter, we document the major limitations of KairosCV as it currently stands, including those related to extraction complexity, AI dependency, output constraints, performance, and deployment realities.

## 20.2 Limitation of Resume Variability

One of the most important limitations of KairosCV is that resumes vary enormously in layout, writing style, and formatting strategy. While the system is designed to support multiple formats and irregular inputs, no finite extraction pipeline can perfectly guarantee ideal handling of every possible resume design.

This means that:

1. Highly unconventional layouts may reduce extraction quality.
2. Dense visual formatting may affect text recovery.
3. Mixed or ambiguous section structures may require interpretation that is not always perfect.

This limitation is not unique to KairosCV, but it remains an important boundary of the system.

## 20.3 Limitation of AI-Dependent Quality

Although AI provides substantial value in the application, it also introduces limitations. The quality of enhancement, classification, and semantic interpretation depends partly on model behavior, which may not always be perfectly consistent.

Possible consequences include:

1. Overly generic wording in some outputs.
2. Variation in phrasing quality across different resumes.
3. Dependence on prompt behavior and model response characteristics.
4. The need for human review before final professional submission.

For this reason, KairosCV should be understood as an intelligent assistive platform rather than as an unquestionable autonomous authority on resume quality.

## 20.4 Limitation of One-Page Output Constraints

The one-page design goal is one of the strengths of the project, but it also introduces an inherent limitation. Some users may provide resumes containing more content than can realistically be displayed on a single page without affecting readability.

This means that:

1. Long resumes may require strong compression.
2. Some information may need to be summarized or de-emphasized.
3. Template choices may affect how much content fits comfortably.
4. The final output may prioritize conciseness over exhaustive detail.

This trade-off is intentional, but it is still a limitation worth documenting clearly.

## 20.5 Limitation of Objective Quality Measurement

The system includes validation and confidence scoring, but resume quality is not purely objective. A resume that is structurally complete and well formatted may still vary in suitability depending on industry, job role, or evaluator preference.

This means that:

1. Scoring logic can reflect completeness more reliably than absolute career value.
2. ATS-friendliness does not fully replace human judgment.
3. Some aspects of quality remain subjective.

This is an important limitation because it reminds us that automated assessment has boundaries.

## 20.6 Limitation of Current Testing Coverage

Although the project includes meaningful testing in important modules, the current test coverage is not exhaustive across all possible user journeys, document layouts, and environment combinations.

Current limitations in testing include:

1. Limited full end-to-end automation.
2. Limited automated UI-level coverage.
3. Difficulty simulating all possible resume structures.
4. Limited objective testing of semantic quality in AI-enhanced content.

This means that the project has a solid quality foundation, but there is still room for broader verification depth in future work.

## 20.7 Limitation of Deployment Complexity

KairosCV is more complex to deploy than a standard static web application because it depends on multiple environment-sensitive services and runtime capabilities.

This includes:

1. AI provider configuration.
2. Authentication and storage setup.
3. Server-side PDF generation support.
4. Cloud-environment-specific browser runtime handling.

As a result, successful deployment requires careful configuration and cannot be assumed to work identically across all hosting platforms without adaptation.

## 20.8 Limitation of Performance Under Heavier Workloads

The present implementation is designed appropriately for capstone-scale use and practical evaluation, but it is not yet optimized as a high-scale enterprise processing system.

Potential performance limitations include:

1. Dependence on AI service responsiveness.
2. Time consumed by multi-stage extraction and validation.
3. Server-side PDF generation overhead.
4. Increased latency for complex input files.

These limitations do not invalidate the project, but they clarify that the current implementation is best understood as a capable academic system rather than a massively scaled production platform.

## 20.9 Limitation of Domain Breadth

The application is focused specifically on resume optimization. It does not currently extend into adjacent domains such as cover-letter generation, recruiter analytics, candidate benchmarking, or interview preparation.

This limitation exists because the capstone scope was intentionally controlled. Although such features could be added later, they are beyond the present implementation.

## 20.10 Limitation of Language and Regional Adaptation

The current project is primarily oriented toward conventional resume structures and professional expectations common to English-language technical job application contexts. Broader support for multilingual resumes or region-specific formatting norms is not yet fully developed.

This means that:

1. Resume expectations in different countries may not be equally represented.
2. Language-specific enhancement quality may vary.
3. The present templates may be more suitable for some professional contexts than others.

This is an important area for future extension.

## 20.11 Importance of Acknowledging Limitations

Documenting limitations is important because it reflects responsible engineering communication. An honest report should clarify where the system performs strongly and where caution or future work is still needed.

From an evaluation perspective, this strengthens the credibility of the project because it shows that the team understands both the achievements and the unfinished edges of the implementation.

## 20.12 Chapter Summary

This chapter documented the principal limitations of KairosCV, including those related to resume variability, AI-dependent output quality, one-page formatting constraints, subjective evaluation boundaries, testing coverage, deployment complexity, performance under heavier workloads, domain scope, and language adaptability. Recognizing these limitations is essential for a balanced and academically credible assessment of the project.
# Chapter 21: Future Enhancements

## 21.1 Introduction

Although KairosCV already provides a meaningful and technically rich resume optimization workflow, the current implementation also opens the door to several future enhancements. Identifying these enhancements is valuable because it shows how the project could evolve beyond its present capstone scope while remaining aligned with the original problem domain.

In this chapter, we document possible directions for extending the system in future iterations, including improvements to personalization, analytics, template variety, evaluation depth, and broader document support.

## 21.2 Importance of Defining Future Enhancements

Future enhancement planning is important for several reasons:

1. It shows awareness of how the system could mature further.
2. It demonstrates that the architecture was designed with extensibility in mind.
3. It helps evaluators understand the long-term potential of the project.
4. It clarifies which ideas were intentionally deferred to keep the capstone scope realistic.

For this reason, the following enhancements should be understood not as missing features alone, but as logical future growth paths for the application.

## 21.3 Enhanced Personalization

One of the most promising future directions for KairosCV is deeper personalization. At present, the system can improve content and optionally use a job description for contextual tailoring. However, future versions could adapt more strongly to the user’s specific background, preferences, and goals.

Possible personalization improvements include:

1. Role-specific optimization modes.
2. Industry-sensitive terminology handling.
3. User preference profiles for template and formatting defaults.
4. Personalized writing tone adjustments based on career stage.

This would make the application more adaptive and potentially more useful for repeated long-term use.

## 21.4 Expanded Template Library

Currently, the system supports multiple templates, but future versions could include a broader selection of presentation styles and formatting strategies.

Possible template-related enhancements include:

1. Industry-specific template sets.
2. More visually distinct layout families.
3. Academic and research-oriented resume formats.
4. Executive or senior-role resume styles.
5. User-customizable section ordering.

This would improve flexibility while preserving the separation between structured data and final rendering.

## 21.5 Improved Resume Analytics

Another valuable future enhancement would be stronger analytics around resume quality. The present system includes confidence scoring and validation-aware assessment, but this could be expanded into richer feedback.

Possible analytics enhancements include:

1. Section-level quality ratings.
2. Keyword-match insights against job descriptions.
3. Suggestions about missing resume elements.
4. Readability-oriented observations.
5. Comparative quality indicators across resume versions.

This would move the platform from optimization-only behavior toward more explicit diagnostic guidance.

## 21.6 Enhanced ATS Matching Support

Since one of the major goals of the platform is ATS-friendly output, future versions could include more direct ATS alignment analysis.

Possible enhancements include:

1. Job-description keyword coverage analysis.
2. Suggestions for improving relevance to target roles.
3. Identification of missing skill alignment.
4. More explicit optimization feedback for role-specific terminology.

This would strengthen the practical value of the platform for users preparing targeted applications.

## 21.7 Version Comparison and Resume Iteration Tracking

Another useful extension would be support for comparing multiple generated resume versions over time. Since users may optimize their resumes for different jobs or revise them periodically, version-aware tracking could become highly valuable.

Possible features include:

1. Resume version history.
2. Comparison between earlier and later outputs.
3. Tracking of changes in summary, skills, or experience presentation.
4. Better organization of multiple role-specific resume variants.

This would strengthen KairosCV as a long-term professional development tool rather than only a one-time optimizer.

## 21.8 Expanded Language and Regional Support

Future versions could also broaden support for multilingual content and region-specific resume norms. This would make the platform more inclusive and applicable across a wider range of user contexts.

Potential improvements include:

1. Multilingual resume processing support.
2. Region-specific date and formatting conventions.
3. Adaptation to country-specific resume expectations.
4. More flexible template localization.

This would significantly expand the applicability of the system.

## 21.9 Broader Document Support

Although KairosCV is focused on resumes, future growth could include support for related career documents while still preserving the current project identity.

Possible document-support expansions include:

1. Cover-letter assistance.
2. Portfolio summary generation.
3. LinkedIn profile summary support.
4. Internship and academic CV variants.

Such features would need to be introduced carefully so that the platform remains focused and coherent.

## 21.10 Stronger Testing and Evaluation Tooling

From an engineering perspective, future work could also improve the internal quality and observability of the system.

Possible improvements include:

1. Broader integration test coverage.
2. UI-level automated testing.
3. Better benchmarking of extraction quality.
4. More robust monitoring for production-like use.
5. Structured evaluation datasets for repeatable testing.

These changes would improve reliability, maintainability, and research value.

## 21.11 Performance and Scalability Enhancements

If KairosCV were to evolve toward broader public use, performance and scalability would become increasingly important.

Possible future improvements include:

1. More efficient pipeline orchestration.
2. Better asynchronous job management.
3. Improved artifact caching strategies.
4. Optimized PDF generation workflows.
5. Resource-aware scaling for concurrent processing.

This would support a transition from capstone-scale use toward larger deployment scenarios.

## 21.12 Importance of Architectural Extensibility

The ability to imagine these future enhancements is closely related to the modular architecture of the project. Because the system separates parsing, AI integration, validation, storage, and rendering concerns, it is more feasible to extend individual layers without completely redesigning the application.

This is an important sign of good system design. A platform with no clear path for future enhancement is usually more tightly coupled and less robust architecturally.

## 21.13 Chapter Summary

This chapter documented possible future enhancements for KairosCV, including stronger personalization, expanded template support, richer analytics, improved ATS matching, resume version comparison, multilingual and regional support, broader document handling, stronger testing infrastructure, and performance-oriented scaling improvements. These enhancements show that the project has meaningful long-term potential beyond its current capstone scope.
# Chapter 22: Conclusion

## 22.1 Introduction

KairosCV was developed as a capstone project with the objective of addressing a practical and widely relevant problem: improving the quality, structure, and usability of resumes through an intelligent web-based platform. Over the course of this project, we designed and implemented a system that accepts resumes in multiple formats, extracts and interprets their content, enhances important sections through AI-assisted processing, validates the structured result, and generates a professional one-page PDF output.

This concluding chapter summarizes the overall contribution of the project, reflects on its technical and practical significance, and provides our final perspective on the work completed.

## 22.2 Summary of the Project Outcome

The final outcome of KairosCV is a full-stack application that combines several technical domains into one coherent workflow. These domains include:

1. Document upload and validation.
2. Multi-format parsing and extraction.
3. AI-assisted content enhancement.
4. Structured resume modeling and validation.
5. Server-side PDF generation.
6. Account-based storage and resume history.
7. Real-time processing feedback.

Taken together, these capabilities demonstrate that the project evolved beyond a basic prototype and into a meaningful platform with multiple interacting layers.

## 22.3 Achievement of Project Objectives

The project objectives defined during planning were largely realized through the implementation. Specifically, the system successfully supports:

1. Resume upload in PDF, DOCX, and TXT formats.
2. Validation and controlled intake of uploaded files.
3. Extraction of resume content from different file types.
4. AI-assisted structuring and enhancement of resume data.
5. Resume rendering into a single-page PDF output.
6. User-facing progress tracking during processing.
7. Account-aware workflows such as dashboard history and settings.
8. Configurable deployment and storage behavior.

While certain advanced improvements remain possible, the core problem targeted by the capstone was addressed successfully through the current system.

## 22.4 Technical Significance of the Work

From a technical perspective, KairosCV is significant because it combines multiple forms of software engineering into one application. The project required us to work across frontend development, backend design, AI integration, file processing, schema validation, persistence, and deployment planning.

The project is particularly notable for:

1. Its pipeline-based architecture.
2. Its attempt to reduce information loss during extraction.
3. Its integration of AI within a validated processing workflow.
4. Its balance between development flexibility and deployment realism.
5. Its effort to produce a polished user-facing experience around a technically complex backend.

These factors make the project a strong example of applied full-stack and AI-assisted software engineering in a capstone setting.

## 22.5 Practical Significance of the Work

The problem addressed by KairosCV is highly practical. Students, graduates, and job seekers often possess valuable experience but struggle to present it effectively in resume form. By offering a system that improves wording, structure, and presentation while preserving the core user content, the project delivers direct real-world value.

This practical significance is important because it means the project is not only technically interesting but also socially and professionally relevant. A strong capstone project should ideally demonstrate both dimensions.

## 22.6 Lessons Learned Through Development

The development of KairosCV provided several important technical and design insights. Through this project, we observed that:

1. Real-world document processing is significantly more complex than controlled text manipulation.
2. AI is most effective when embedded in a structured and validated workflow.
3. User trust improves when backend processing is made transparent through feedback.
4. Modularity is essential when a project spans multiple technical concerns.
5. Deployment awareness is necessary even in academic project contexts.

These lessons strengthened not only the final system but also our understanding of applied software engineering practices.

## 22.7 Evaluation of the System as a Capstone Project

As a capstone submission, KairosCV demonstrates several qualities that make it suitable for academic evaluation:

1. It solves a real and relevant problem.
2. It involves substantial technical depth.
3. It integrates multiple layers of the software stack.
4. It shows awareness of architecture, validation, security, and deployment.
5. It includes meaningful opportunities for future extension.

The project also reflects teamwork-oriented design thinking, because many of its parts required coordination between user experience decisions, backend logic, and infrastructure-related concerns.

## 22.8 Balanced Final Assessment

It is also important to assess the project realistically. KairosCV is not an exhaustive enterprise-grade career platform, nor does it eliminate the need for human judgment in all resume decisions. It remains a focused academic system with meaningful technical breadth, practical value, and identifiable future directions.

This balanced view is appropriate because it acknowledges both the strengths of the implementation and the natural limits of a capstone project’s scope.

## 22.9 Final Remarks

In conclusion, KairosCV represents a successful attempt to apply modern software engineering and AI-assisted processing to a problem that is both practical and technically demanding. Through this project, we developed a platform that demonstrates structured thinking, modular design, attention to user experience, and awareness of deployment and quality concerns.

We believe the project stands as a strong capstone outcome because it combines clear problem relevance with substantial engineering effort. It also establishes a meaningful foundation for future extension, whether in academic research, product refinement, or broader real-world deployment.

## 22.10 Chapter Summary

This chapter concluded the report by summarizing the outcomes, objectives, significance, lessons, and final assessment of KairosCV. The project demonstrates that a resume optimization platform can be built as a technically rich, user-oriented, and evaluation-ready full-stack system, while still leaving clear paths for future growth and improvement.
# Chapter 23: Appendices

## 23.1 Introduction

The appendices provide supporting material that complements the main body of the report. Their purpose is to collect structured reference information that may be useful to evaluators, reviewers, or future maintainers without interrupting the flow of the primary chapters.

In the context of KairosCV, the appendices are especially useful because the project spans multiple technical areas. Supplementary reference material helps organize this complexity in a concise and accessible form.

## 23.2 Suggested Repository Structure Reference

For evaluation and maintenance purposes, it is useful to include a reference view of the project structure. This can help readers understand where the major parts of the application reside.

The most relevant structural areas include:

1. `app/` for route-based pages and API endpoints.
2. `components/` for reusable frontend UI components.
3. `hooks/` for client-side behavioral logic.
4. `lib/` for backend logic, processing modules, validation, storage helpers, and AI support.
5. `docs/` for technical supporting documentation.
6. `documentation/` for the academic report structure being prepared.
7. `public/` for static assets.
8. `supabase/` for database or platform setup resources.
9. `__tests__/` for test coverage.

*Placeholder: Insert a cleaned project folder tree diagram or a formatted repository structure figure suitable for the final report.*

## 23.3 Important Modules and Files

For readers who want to understand the technical implementation quickly, the following categories of files are especially important:

### Application Entry and Routing

Relevant areas include page-level files and API route definitions that control the user journey and backend entry points.

### Resume Processing Logic

Files in the processing and extraction layers are central because they implement the transformation from uploaded resume to structured and optimized output.

### AI Integration Logic

Modules related to AI extraction, enhancement, and field support are important because they provide the semantic and language-aware capabilities of the platform.

### Validation and Schema Logic

Validation and schema files define the internal data contract used across the pipeline.

### Rendering and Template Logic

Template and PDF-related modules are important because they control the final structure and appearance of the generated resume.

### Storage and Authentication Support

Storage helpers, Supabase-related modules, and middleware are important because they support persistence, access control, and platform behavior.

## 23.4 Sample Environment Configuration

For the final report, it may be useful to include a simplified and sanitized reference configuration showing the categories of environment variables required by the application.

These categories include:

1. AI provider configuration.
2. Application runtime settings.
3. Authentication and Supabase settings.
4. Storage-related settings.
5. PDF generation or browser runtime settings.
6. Trial limiting configuration.

When including such a configuration in the final report, it is important to avoid exposing any real secret values.

*Placeholder: Insert a sanitized environment-configuration table or figure showing the major environment variable groups used by the project.*

## 23.5 Sample Processing Flow Reference

Another useful appendix element would be a compact summary of the full processing workflow. This can act as a quick reference for readers who want to revisit the pipeline without re-reading all detailed chapters.

A concise reference flow may be expressed as:

1. File upload.
2. Validation.
3. Storage and metadata registration.
4. Raw text extraction.
5. Structured data extraction.
6. AI enhancement and verification.
7. Cleanup and validation.
8. PDF generation.
9. Output storage and download delivery.

This kind of summary is particularly helpful in viva or presentation contexts.

*Placeholder: Insert a one-page flowchart of the complete KairosCV processing pipeline suitable for appendix use.*

## 23.6 Suggested Visual Appendix Items

To strengthen the final document further, the following visuals would be appropriate appendix inclusions:

1. Project architecture diagram.
2. Processing pipeline diagram.
3. Dashboard screenshot.
4. Optimize page screenshot.
5. Progress tracker screenshot.
6. Final generated PDF sample screenshot.
7. Repository structure figure.
8. Deployment and environment diagram.

These visuals would improve readability and help evaluators understand the system quickly.

## 23.7 Suggested Reference Material

The final report may also include supporting references such as:

1. Official documentation for major frameworks used.
2. Documentation for Supabase integration.
3. Documentation for the AI providers involved.
4. References related to PDF generation or browser-based rendering.
5. Resume and ATS-oriented best-practice sources where appropriate.

This would help position the project within a wider technical and practical context.

## 23.8 Purpose of the Appendices in Evaluation

The appendices are not secondary in importance simply because they appear at the end of the report. In an evaluation setting, appendices often improve clarity by making it easier for reviewers to inspect implementation context, structure, environment assumptions, and supporting visuals without interrupting the analytical flow of earlier chapters.

For KairosCV, the appendices are particularly valuable because the project includes many moving parts. Summarized technical references therefore make the overall submission easier to review and discuss.

## 23.9 Chapter Summary

This chapter documented the supporting appendix material appropriate for the KairosCV report, including repository structure references, important implementation modules, environment configuration categories, a compact processing flow reference, suggested visuals, and possible technical references. These appendices can strengthen the final submission by making the project easier to inspect, evaluate, and present.

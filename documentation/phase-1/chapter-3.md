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

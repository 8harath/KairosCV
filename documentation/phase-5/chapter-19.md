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

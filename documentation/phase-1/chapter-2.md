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

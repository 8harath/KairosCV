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

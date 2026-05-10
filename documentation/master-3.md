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

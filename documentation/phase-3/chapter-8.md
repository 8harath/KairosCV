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

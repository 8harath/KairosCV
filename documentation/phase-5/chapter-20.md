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

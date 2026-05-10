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

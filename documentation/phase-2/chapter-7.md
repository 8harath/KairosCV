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

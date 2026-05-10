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

# Chapter 12: Authentication and Access Control

## 12.1 Introduction

Authentication and access control are important parts of KairosCV because the application is not limited to anonymous file processing. It also supports user-linked resume history, protected platform areas, and profile-based workflows. In this chapter, we document how authentication is handled in the system and how access control supports both security and usability.

While designing the project, we wanted the application to function as a reusable workspace rather than only a temporary conversion utility. For that reason, identity management and controlled access were integrated into the platform structure.

## 12.2 Purpose of Authentication in KairosCV

Authentication in KairosCV serves several practical and architectural purposes:

1. It restricts access to protected parts of the application.
2. It links generated resumes to specific users.
3. It supports persistent dashboard history.
4. It enables profile-related settings and account-specific information.
5. It provides a more realistic platform design for deployment and evaluation.

Without authentication, the system could still process resumes, but it would lose important capabilities related to personalization, persistence, and controlled access.

## 12.3 Supabase as the Authentication Provider

KairosCV uses Supabase to support authentication and session-aware account behavior. This allowed us to avoid building a custom authentication system from the ground up while still supporting the login and account structure required by the project.

The use of Supabase supports:

1. User login and signup workflows.
2. Session management.
3. Access to user identity information.
4. Protected route enforcement in conjunction with middleware and server-side checks.
5. Integration with other account-linked records such as profiles and generated resumes.

This made Supabase a practical choice for the scope and goals of the project.

## 12.4 Protected Application Areas

Not all parts of the KairosCV interface are equally sensitive. Some pages represent general entry points, while others expose user-specific information or operational features that should be restricted.

Protected areas include:

1. The dashboard.
2. The optimize page.
3. The settings page.

These areas depend on user identity or provide access to personalized functionality. As a result, they are treated differently from public or semi-public entry points.

## 12.5 Access Control Flow

The access control behavior of the application can be described as a sequence of checks:

1. A user attempts to access a route.
2. The system determines whether the route is protected.
3. If authentication is enabled, the session is checked.
4. If the user is not authenticated, the system redirects to the login flow.
5. If the user is authenticated, access is granted.

This flow ensures that protected application areas remain account-aware and that unauthorized access is handled consistently.

*Placeholder: Insert an access control flow diagram showing user request, session check, protected route decision, redirect behavior, and successful access path.*

## 12.6 Middleware-Based Protection

One of the important structural choices in KairosCV is that access control is supported at the routing layer rather than handled only inside individual page logic. Middleware helps evaluate route access before the protected page is fully served.

This design offers several benefits:

1. It centralizes route protection behavior.
2. It reduces repeated authentication checks in unrelated places.
3. It makes access rules easier to reason about.
4. It provides a cleaner and more maintainable security structure.

Using middleware in this way reflects a more disciplined access-control design.

## 12.7 Session Handling

Authentication is meaningful only if the system can maintain and verify user sessions consistently. Session handling in KairosCV allows the system to recognize whether a user is currently authenticated and whether protected resources should be available.

Session-aware behavior affects:

1. Page access decisions.
2. Backend route authorization.
3. Dashboard personalization.
4. Retrieval of user-linked profile data.
5. Ownership-aware storage and history access.

This makes session handling an important foundation for the account-based behavior of the application.

## 12.8 User-Specific Resume History

One of the major reasons authentication matters in KairosCV is that generated resumes can be associated with specific users. This allows the system to present a personalized history view in the dashboard.

This feature supports:

1. Retrieval of recent generated resumes.
2. Ownership-aware access to outputs.
3. Better continuity for repeated platform use.
4. A stronger sense of the application as a personal workspace.

By linking resume outputs to authenticated users, the system becomes more useful over time rather than only during a single session.

## 12.9 Profile-Linked Operations

Authentication also supports operations beyond resume generation itself. The application includes profile-aware behaviors such as displaying user information and account-related data in the dashboard and settings pages.

This contributes to:

1. A more complete user experience.
2. Better personalization.
3. Stronger persistence of user state across sessions.

These features help position KairosCV as a full platform rather than only a processing endpoint.

## 12.10 Development Mode and Authentication Bypass

During implementation, development convenience was also an important concern. For this reason, KairosCV supports a configuration mode in which authentication can be bypassed during local development.

This was useful because it allowed us to:

1. Test resume processing flows quickly.
2. Avoid repeated dependency on authentication setup during local iteration.
3. Focus on pipeline development while still preserving production-style authentication behavior in the main design.

This bypass mode is a development aid, not a replacement for the intended protected architecture of the deployed application.

## 12.11 Access Control as a Quality Concern

From a software engineering perspective, access control in KairosCV is not only about preventing unauthorized access. It also contributes to system quality by making user behavior more predictable and by ensuring that personal data and generated artifacts are handled within clear ownership boundaries.

This is especially relevant because resumes contain personal and professional information. Protecting access to user-linked content is therefore an important aspect of platform responsibility.

## 12.12 Evaluation Perspective

From an academic evaluation standpoint, the authentication and access-control design strengthens the project in several ways:

1. It demonstrates platform realism.
2. It connects user identity with system persistence.
3. It reflects practical security awareness.
4. It improves the completeness of the user workflow.
5. It shows attention to deployment-oriented behavior rather than only prototype functionality.

These qualities make authentication and access control an important part of the project’s overall design maturity.

## 12.13 Chapter Summary

This chapter documented how authentication and access control are handled in KairosCV, including the use of Supabase, the protection of key application areas, session-aware behavior, user-linked resume history, profile-based operations, and development-oriented authentication bypass. Together, these mechanisms help ensure that the platform supports secure, personalized, and realistic application behavior.

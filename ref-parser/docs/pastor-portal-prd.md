# Reimagined Pastor Portal PRD

## 1. Product Overview
- **Product name:** Pastor Portal (Working Title)
- **Primary users:** Lead and associate pastors, worship leaders, church administrators.
- **Product vision:** Deliver a unified, modern web experience that helps church leaders plan, communicate, and execute weekly services with confidence. The portal should feel polished, intuitive, and emotionally supportive—reducing administrative friction while elevating storytelling for sermons.
- **Problem statement:** Current tools are fragmented, visually dated, and require excessive manual coordination. Staff struggle to align on sermon direction, worship elements, and volunteer logistics, leading to inconsistencies and last-minute stress.
- **Goal:** Provide a beautiful, purpose-built hub that centralizes service planning, creative collaboration, and execution assets in one cohesive interface.

## 2. Success Metrics
1. 80% of pastors complete a full service plan in the portal without external tools within three weeks of adoption.
2. Reduce average weekly coordination time by 30% (self-reported) compared to prior workflow.
3. Achieve 90% user satisfaction in quarterly surveys covering clarity, aesthetic appeal, and collaboration features.
4. Weekly active usage from at least two distinct roles (e.g., pastor + worship leader) for 70% of churches within 60 days.

## 3. Target Audience & Use Cases
### Primary Personas
1. **Lead Pastor (Visionary)**
   - Needs: Craft sermon narratives, share notes, align team on theme and takeaways.
   - Pain: Disorganized drafts, late feedback, inconsistent communication.
2. **Worship Leader (Creative Collaborator)**
   - Needs: Build worship setlists, coordinate with sermon themes, manage rehearsal assets.
   - Pain: Manual updates, lack of visibility into sermon flow.
3. **Church Administrator (Operations)**
   - Needs: Track volunteers, announcements, logistics.
   - Pain: Multiple spreadsheets, limited communication channels.

### Secondary Personas
- Communications director, media team, small group leaders—require read-only access and asset downloads.

### Key Jobs to Be Done
- Draft and evolve a sermon plan with supporting media.
- Build service run sheets with worship sets, transitions, and cues.
- Share high-level vision and assets with stakeholders (e.g., small groups).
- Manage volunteer assignments and deadlines.

## 4. Core Value Propositions
1. **Narrative-first planning:** Structured spaces for theme, scripture, key points, and storytelling elements.
2. **Collaborative alignment:** Real-time commenting, versioning, and approvals across roles.
3. **Visual excellence:** A modern interface that feels calm, premium, and inspiring, reflecting the spiritual weight of the work.
4. **Operational clarity:** Smart reminders, timelines, and volunteer management to reduce surprises.

## 5. Feature Scope
### 5.1 Dashboard
- Snapshot of upcoming services (next 4 weeks) with status indicators (Draft, In Review, Finalized).
- Cards for outstanding tasks, recent comments, and quick-start actions ("Start new sermon series", "Add worship set").
- Inspirational verse or quote tile rotating weekly.

### 5.2 Sermon Planner
- Structured sections: Series overview, weekly theme, scripture references, big idea, practical application, key quotes.
- Rich text editor with template snippets and drag-to-reorder sections.
- Attachment support for slides, outlines, and external resources.
- Collaboration tools: inline commenting, revision history, approval state toggles.
- Export options (PDF, print-friendly) with brand styling.

### 5.3 Service Builder
- Timeline view of service segments (Countdown, Welcome, Worship Set, Message, Communion, etc.).
- Drag-and-drop ordering with estimated durations and automatic total time calculation.
- Integration of sermon elements (e.g., key points, media cues) directly into the run sheet.
- Quick assign volunteers or teams per segment (host, tech, band).
- Multiple view modes: linear timeline, printable run sheet, rehearsal checklist.

### 5.4 Worship Set Manager
- Library of songs with metadata (key, tempo, energy level, familiarity rating).
- Smart suggestions based on sermon theme, liturgical season, or past usage.
- Link to chord charts, lyrics, backing tracks.
- Rehearsal mode: shareable setlist with notes, attachments, and scheduling.

### 5.5 Volunteer & Task Coordination
- Roster management with availability tracking.
- Task assignments with due dates, reminders, and status updates.
- Broadcast announcements to volunteer teams (email/text integration planned later).

### 5.6 Communication & Sharing
- Weekly summary digest automatically generated for staff (includes sermon overview, worship plan, logistics).
- Shareable "vision doc" link for read-only stakeholders.
- Public-friendly version for congregation announcements (optional).

### 5.7 Analytics & Insights (Phase 2+)
- Track preparation timelines, volunteer gaps, song frequency.
- Provide insights like "Your last three series emphasized hope—consider diversifying topics." (machine learning enhancements optional).

## 6. User Experience Principles
1. **Calm & Focused:** Soft gradients, generous white space, typography that feels editorial (e.g., pairing a serif display with modern sans-serif body).
2. **Storytelling forward:** Emphasize narrative sections visually; use cards, layered backgrounds, and gentle motion to indicate progression.
3. **Collaborative clarity:** All collaborative actions (comments, approvals) should be surfaced in-context with clear affordances.
4. **Inspiration meets productivity:** Balance aesthetic beauty (background photography, subtle animations) with pragmatic controls (filters, quick actions).
5. **Accessible by design:** High contrast, readable font sizes, keyboard navigation, screen reader support from day one.

## 7. Visual & Brand Direction
- **Mood:** Warm, uplifting, modern. Inspiration from premium productivity apps (Notion, Asana) blended with the serene ambiance of devotional literature.
- **Color palette:** Base neutrals (soft ivory, muted charcoal), accent colors inspired by liturgical seasons (deep navy, royal plum, sunrise gold, evergreen). Allow customizable accent to match church branding.
- **Typography:** Primary heading font: elegant serif or rounded display (e.g., "Recoleta", "DM Serif Display"). Body font: clean sans (e.g., "Inter", "Nunito Sans"). Ensure fallback web-safe fonts.
- **Iconography:** Minimalist, line-based icons with rounded corners. Use custom illustrations sparingly to highlight key empty states.
- **Imagery:** Optional hero images featuring abstract stained glass textures or subtle nature photography, blurred to avoid distraction.
- **Micro-interactions:** Smooth transitions when switching views, ambient hover states, progress indicators that feel encouraging (e.g., progress rings with affirming copy like "Almost there!").

## 8. Information Architecture
1. **Primary navigation (left sidebar):** Dashboard, Sermons, Services, Worship, Volunteers, Insights (later), Settings.
2. **Secondary navigation (contextual tabs):** For a given sermon or service—Overview, Content, Assets, Collaborators, History.
3. **Global actions:** "Create" button in header with quick actions (New Sermon, New Service, Add Song, Invite Volunteer).
4. **Utility bar:** Notifications, search, profile, church switcher (for multi-campus support).

## 9. User Flows (High-Level)
1. **Create New Series:** Dashboard CTA → choose template → fill series overview → auto-generate first week → invite collaborators.
2. **Weekly Service Prep:** Select upcoming service → review sermon draft → align worship set → assign volunteers → export run sheet.
3. **Volunteer Assignment:** Navigate to Volunteers → view calendar availability → assign roles → send confirmation → track responses.
4. **Content Sharing:** Finish sermon → generate weekly digest → share read-only link to staff and small groups.

## 10. Functional Requirements
- Role-based access control (Admin, Editor, Contributor, Viewer).
- Real-time updates for collaborative edits (WebSocket or equivalent).
- Version history with ability to restore prior snapshots.
- Autosave and offline-resilient draft storage.
- Responsive layout scaling elegantly from desktop to tablet; mobile experience focused on review/approvals, not heavy editing.
- Integrations (future): Planning Center import/export, Google Calendar sync, ProPresenter export.

## 11. Non-Functional Requirements
- Fast initial load (<2.5s on average broadband).
- WCAG 2.1 AA compliance.
- Data security: encrypted at rest/in transit, audit logs for changes.
- Internationalization-ready (copy stored in translation files).
- Scalable architecture to support multi-campus churches.

## 12. Release Plan
1. **MVP (3 months):** Dashboard, Sermon Planner, Service Builder, basic Worship Set Manager, core volunteer assignments, commenting, exports.
2. **Post-MVP (6 months):** Advanced volunteer scheduling, analytics, customizable templates, mobile review mode.
3. **Future Enhancements:** AI-assisted sermon prompts, congregation engagement insights, livestream integration.

## 13. Risks & Mitigations
- **Adoption barrier:** Provide onboarding templates and in-app coaching to reduce learning curve.
- **Data migration:** Offer CSV import wizards and white-glove onboarding for early adopters.
- **Scope creep:** Maintain a feature backlog with prioritization matrix; gate new ideas behind data-driven evaluation.

## 14. Open Questions
1. What external systems must we integrate with at launch (e.g., Planning Center, Mailchimp)?
2. Do we need multi-campus hierarchy at MVP or can it wait?
3. What is the compliance requirement for communications (SMS/email regulations)?
4. What is the brand strategy—does the church want white-labeling or co-branding?

## 15. Appendices
- **Reference Inspiration:** Notion (clean modular layout), Asana (task clarity), Figma (collaboration), Headspace (calming aesthetic).
- **Key Terms:** Sermon series, service run sheet, worship set, volunteer roster.

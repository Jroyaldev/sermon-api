"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import { recentComments, sermonSections as defaultSections, sermonSeries } from "../../data/mock-data";

type HighlightKey = `${string}-${string}`;

export default function SermonsPage() {
  const [sections, setSections] = useState(defaultSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id ?? "");
  const [completedHighlights, setCompletedHighlights] = useState<Set<HighlightKey>>(
    () => new Set(),
  );
  const [newHighlight, setNewHighlight] = useState("");
  const [downloadedAttachments, setDownloadedAttachments] = useState<string[]>([]);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackRole, setFeedbackRole] = useState<string>("All");

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId) ?? sections[0] ?? null,
    [sections, selectedSectionId],
  );

  const roleOptions = useMemo(() => {
    const roles = new Set<string>();
    recentComments.forEach((comment) => roles.add(comment.role));
    return ["All", ...Array.from(roles)];
  }, []);

  const filteredFeedback = useMemo(() => {
    return recentComments.filter((comment) => {
      const matchesRole = feedbackRole === "All" || comment.role === feedbackRole;
      const matchesSearch = `${comment.author} ${comment.excerpt}`
        .toLowerCase()
        .includes(feedbackSearch.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [feedbackRole, feedbackSearch]);

  const toggleHighlight = (sectionId: string, highlight: string) => {
    const key = `${sectionId}-${highlight}` as HighlightKey;
    setCompletedHighlights((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleAddHighlight = () => {
    if (!selectedSection || !newHighlight.trim()) {
      return;
    }

    setSections((previous) =>
      previous.map((section) =>
        section.id === selectedSection.id
          ? {
              ...section,
              highlights: [...section.highlights, newHighlight.trim()],
            }
          : section,
      ),
    );
    setNewHighlight("");
  };

  const handleSummaryChange = (summary: string) => {
    if (!selectedSection) {
      return;
    }

    setSections((previous) =>
      previous.map((section) =>
        section.id === selectedSection.id ? { ...section, summary } : section,
      ),
    );
  };

  const toggleAttachment = (name: string) => {
    setDownloadedAttachments((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name],
    );
  };

  return (
    <div className="page-content">
      <Card
        title={sermonSeries.title}
        subtitle={sermonSeries.description}
        action={<span className="tag">{sermonSeries.approvalStatus}</span>}
      >
        <div className="grid grid--two">
          <div className="list">
            <div className="list-item">
              <span className="caption">Primary scripture</span>
              <strong>{sermonSeries.scriptureFocus}</strong>
            </div>
            <div className="list-item">
              <span className="caption">Attachments</span>
              <ul className="list">
                {sermonSeries.attachments.map((attachment) => {
                  const isDownloaded = downloadedAttachments.includes(attachment.name);
                  return (
                    <li key={attachment.name} className="list-item">
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                        <span>{attachment.name}</span>
                        <button
                          type="button"
                          className={`button button--sm${isDownloaded ? "" : " button--ghost"}`}
                          onClick={() => toggleAttachment(attachment.name)}
                        >
                          {isDownloaded ? "Saved" : "Download"}
                        </button>
                      </div>
                      <span className="caption">{attachment.size}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="list">
            <div className="list-item">
              <span className="caption">Teaching reminders</span>
              <p style={{ margin: 0 }}>
                Highlight the anchor imagery early, pause for guided silence, and end with a collective
                blessing.
              </p>
            </div>
            <div className="list-item">
              <span className="caption">Your prep note</span>
              <textarea
                className="textarea"
                value={newHighlight}
                onChange={(event) => setNewHighlight(event.target.value)}
                placeholder="Capture new illustration or question"
                aria-label="Draft new highlight"
              />
              <button className="button button--sm" type="button" onClick={handleAddHighlight}>
                Add to selected section
              </button>
              <span className="caption">{newHighlight.length} characters</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid--two">
        <Card title="Sermon outline" subtitle="Select a section to edit">
          <ul className="list">
            {sections.map((section) => (
              <li key={section.id} className="list-item">
                <button
                  type="button"
                  className={`list-interactive${
                    selectedSectionId === section.id ? " list-interactive--active" : ""
                  }`}
                  onClick={() => setSelectedSectionId(section.id)}
                >
                  <strong>{section.title}</strong>
                  <span className="caption">{section.summary}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Section details" subtitle={selectedSection?.title ?? ""}>
          {selectedSection ? (
            <div className="list">
              <label className="field">
                <span>Summary</span>
                <textarea
                  className="textarea"
                  value={selectedSection.summary}
                  onChange={(event) => handleSummaryChange(event.target.value)}
                  aria-label="Update section summary"
                />
              </label>
              <div className="list-item">
                <span className="caption">Key moments</span>
                <ul className="list">
                  {selectedSection.highlights.map((highlight) => {
                    const key = `${selectedSection.id}-${highlight}` as HighlightKey;
                    const isComplete = completedHighlights.has(key);
                    return (
                      <li key={key} className="list-item">
                        <label className="checkbox-row">
                          <span
                            className={`checkbox${isComplete ? " checkbox--checked" : ""}`}
                            aria-hidden
                          >
                            <input
                              type="checkbox"
                              checked={isComplete}
                              onChange={() => toggleHighlight(selectedSection.id, highlight)}
                              aria-label={`Toggle highlight ${highlight}`}
                            />
                            {isComplete && <span>✓</span>}
                          </span>
                          <span>{highlight}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a section to see its details.</div>
          )}
        </Card>
      </div>

      <Card
        title="Recent feedback"
        subtitle="Stay aligned with your collaborators"
        action={
          <div className="toolbar__filters">
            <select
              className="select"
              value={feedbackRole}
              onChange={(event) => setFeedbackRole(event.target.value)}
              aria-label="Filter feedback by role"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <input
              className="input"
              value={feedbackSearch}
              onChange={(event) => setFeedbackSearch(event.target.value)}
              placeholder="Search feedback"
              aria-label="Search feedback"
            />
          </div>
        }
      >
        <ul className="list">
          {filteredFeedback.map((comment) => (
            <li key={comment.id} className="list-item">
              <strong>{comment.author}</strong>
              <p className="card__subtitle" style={{ margin: 0 }}>{comment.excerpt}</p>
              <div className="list-item__meta">
                <span>{comment.role}</span>
                <span>{comment.timeAgo}</span>
              </div>
            </li>
          ))}
          {filteredFeedback.length === 0 && (
            <li className="list-item">
              <span className="caption">No feedback matches those filters yet.</span>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}

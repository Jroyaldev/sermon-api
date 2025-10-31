"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import ServiceTimeline from "../components/ServiceTimeline";
import { rehearsalChecklist, serviceSegments as defaultSegments } from "../../data/mock-data";
import type { ServiceSegment } from "../../data/mock-data";

type ChecklistItem = { label: string; done: boolean };

type DraftSegment = Pick<ServiceSegment, "title" | "owner"> & { duration: number };

export default function ServicesPage() {
  const [segments, setSegments] = useState(defaultSegments);
  const [focusedSegmentId, setFocusedSegmentId] = useState<string | null>(segments[0]?.id ?? null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    rehearsalChecklist.map((item) => ({ label: item, done: false })),
  );
  const [draftSegment, setDraftSegment] = useState<DraftSegment>({
    title: "",
    owner: "",
    duration: 5,
  });

  const focusedSegment = useMemo(
    () => segments.find((segment) => segment.id === focusedSegmentId) ?? null,
    [segments, focusedSegmentId],
  );

  const completedChecklist = checklist.filter((item) => item.done).length;
  const checklistProgress = checklist.length
    ? Math.round((completedChecklist / checklist.length) * 100)
    : 0;

  const moveSegment = (segmentId: string, direction: "up" | "down") => {
    setSegments((previous) => {
      const next = [...previous];
      const index = next.findIndex((segment) => segment.id === segmentId);
      if (index === -1) {
        return previous;
      }
      const targetIndex = direction === "up" ? Math.max(0, index - 1) : Math.min(next.length - 1, index + 1);
      if (targetIndex === index) {
        return previous;
      }
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  const adjustDuration = (segmentId: string, delta: number) => {
    setSegments((previous) =>
      previous.map((segment) =>
        segment.id === segmentId
          ? { ...segment, duration: Math.max(1, segment.duration + delta) }
          : segment,
      ),
    );
  };

  const changeStatus = (segmentId: string, status: ServiceSegment["status"]) => {
    setSegments((previous) =>
      previous.map((segment) =>
        segment.id === segmentId ? { ...segment, status } : segment,
      ),
    );
  };

  const toggleChecklistItem = (label: string) => {
    setChecklist((previous) =>
      previous.map((item) =>
        item.label === label ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const handleDraftChange = (updates: Partial<DraftSegment>) => {
    setDraftSegment((previous) => ({ ...previous, ...updates }));
  };

  const handleCreateSegment = () => {
    if (!draftSegment.title.trim()) {
      return;
    }

    const newSegment: ServiceSegment = {
      id: `seg-${Date.now()}`,
      title: draftSegment.title.trim(),
      owner: draftSegment.owner.trim() || "TBD",
      duration: Math.max(1, Math.round(draftSegment.duration)),
      notes: "Newly added segment",
      volunteers: [],
      status: "Planned",
    };

    setSegments((previous) => [...previous, newSegment]);
    setFocusedSegmentId(newSegment.id);
    setDraftSegment({ title: "", owner: "", duration: 5 });
  };

  return (
    <div className="page-content">
      <Card title="Service builder" subtitle="Adjust the flow for September 22">
        <ServiceTimeline
          segments={segments}
          onMove={moveSegment}
          onAdjustDuration={adjustDuration}
          onStatusChange={changeStatus}
          onFocusSegment={setFocusedSegmentId}
        />
      </Card>

      <div className="grid grid--two">
        <Card
          title="Rehearsal checklist"
          subtitle="Track prep progress for the team"
          action={
            <div className="progress-bar" aria-label="Checklist progress">
              <div className="progress-bar__track">
                <div
                  className="progress-bar__value"
                  style={{ transform: `scaleX(${checklistProgress / 100})` }}
                  aria-hidden
                />
              </div>
              <span className="caption">{checklistProgress}% complete</span>
            </div>
          }
        >
          <ul className="list">
            {checklist.map((item) => (
              <li key={item.label} className="list-item">
                <label className="checkbox-row">
                  <span
                    className={`checkbox${item.done ? " checkbox--checked" : ""}`}
                    aria-hidden
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(item.label)}
                      aria-label={`Toggle ${item.label}`}
                    />
                    {item.done && <span>✓</span>}
                  </span>
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Focused segment" subtitle="Review the current spotlight">
          {focusedSegment ? (
            <div className="list">
              <div className="list-item">
                <span className="caption">Owner</span>
                <strong>{focusedSegment.owner}</strong>
              </div>
              <div className="list-item">
                <span className="caption">Duration</span>
                <span>{focusedSegment.duration} minutes</span>
              </div>
              <label className="field">
                <span>Status</span>
                <select
                  className="select"
                  value={focusedSegment.status}
                  onChange={(event) => changeStatus(focusedSegment.id, event.target.value as ServiceSegment["status"])}
                >
                  <option value="Planned">Planned</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Live">Live</option>
                </select>
              </label>
              <div className="list-item">
                <span className="caption">Volunteers</span>
                <ul className="list">
                  {focusedSegment.volunteers.length === 0 && (
                    <li className="list-item">
                      <span className="caption">Add volunteers once confirmed.</span>
                    </li>
                  )}
                  {focusedSegment.volunteers.map((volunteer) => (
                    <li key={`${focusedSegment.id}-${volunteer.role}`} className="list-item">
                      <span>{volunteer.name}</span>
                      <span className="list-item__meta">{volunteer.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a segment from the builder to review it.</div>
          )}
        </Card>
      </div>

      <Card title="Add segment" subtitle="Keep services fresh" highlight>
        <div className="grid grid--two">
          <label className="field">
            <span>Segment title</span>
            <input
              className="input"
              value={draftSegment.title}
              onChange={(event) => handleDraftChange({ title: event.target.value })}
              placeholder="Testimony or prayer moment"
              aria-label="Segment title"
            />
          </label>
          <label className="field">
            <span>Lead</span>
            <input
              className="input"
              value={draftSegment.owner}
              onChange={(event) => handleDraftChange({ owner: event.target.value })}
              placeholder="Team or person"
              aria-label="Segment lead"
            />
          </label>
          <label className="field">
            <span>Duration (minutes)</span>
            <input
              className="input"
              type="number"
              min={1}
              value={draftSegment.duration}
              onChange={(event) => handleDraftChange({ duration: Number(event.target.value) })}
              aria-label="Segment duration"
            />
          </label>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={handleCreateSegment}
          disabled={!draftSegment.title.trim()}
        >
          Add segment to plan
        </button>
        <span className="caption">
          New segments default to planned status—you can re-order them in the builder above.
        </span>
      </Card>
    </div>
  );
}

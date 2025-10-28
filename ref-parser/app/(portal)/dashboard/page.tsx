"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import {
  analyticsHighlights,
  outstandingTasks,
  quickActions,
  recentComments,
  upcomingServices,
  weeklyDigest,
} from "../../data/mock-data";
import type { ServiceStatus, TaskItem } from "../../data/mock-data";

type TaskState = TaskItem & { done: boolean; originalStatus: TaskItem["status"] };

type ServiceFilter = "All" | ServiceStatus;

type CampusFilter = "All" | string;

const STATUS_FILTERS: ServiceFilter[] = ["All", "Draft", "In Review", "Finalized"];

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<ServiceFilter>("All");
  const [campusFilter, setCampusFilter] = useState<CampusFilter>("All");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    upcomingServices[0]?.id ?? null,
  );
  const [tasks, setTasks] = useState<TaskState[]>(() =>
    outstandingTasks.map((task) => ({
      ...task,
      done: task.status === "Complete",
      originalStatus: task.status,
    })),
  );
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [digestSharedAt, setDigestSharedAt] = useState<string | null>(null);
  const [commentQuery, setCommentQuery] = useState("");
  const [pinnedActions, setPinnedActions] = useState<string[]>([]);
  const [focusNotes, setFocusNotes] = useState("Draft prayer moment for service close.");

  const campusOptions = useMemo(() => {
    const unique = new Set<string>();
    upcomingServices.forEach((service) => unique.add(service.campus));
    return ["All", ...Array.from(unique)] as CampusFilter[];
  }, []);

  const statusCounts = useMemo(() => {
    return upcomingServices.reduce<Record<ServiceStatus, number>>(
      (accumulator, service) => {
        accumulator[service.status] += 1;
        return accumulator;
      },
      { Draft: 0, "In Review": 0, Finalized: 0 },
    );
  }, []);

  const filteredServices = useMemo(() => {
    return upcomingServices.filter((service) => {
      const matchesStatus =
        statusFilter === "All" ? true : service.status === statusFilter;
      const matchesCampus =
        campusFilter === "All" ? true : service.campus === campusFilter;
      return matchesStatus && matchesCampus;
    });
  }, [campusFilter, statusFilter]);

  const selectedService = useMemo(
    () => upcomingServices.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId],
  );

  const sortedTasks = useMemo(() => {
    const visible = showCompletedTasks ? tasks : tasks.filter((task) => !task.done);
    return [...visible].sort((first, second) => Number(first.done) - Number(second.done));
  }, [showCompletedTasks, tasks]);

  const filteredComments = useMemo(() => {
    if (!commentQuery.trim()) {
      return recentComments;
    }
    const normalizedQuery = commentQuery.toLowerCase();
    return recentComments.filter((comment) =>
      `${comment.author} ${comment.role} ${comment.excerpt}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [commentQuery]);

  const handleTaskToggle = (taskId: string) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: !task.done,
              status: !task.done ? "Complete" : task.originalStatus,
            }
          : task,
      ),
    );
  };

  const handleDigestShared = () => {
    const now = new Date();
    setDigestSharedAt(now.toLocaleTimeString());
  };

  const handlePinAction = (actionId: string) => {
    setPinnedActions((previous) =>
      previous.includes(actionId)
        ? previous.filter((id) => id !== actionId)
        : [...previous, actionId],
    );
  };

  return (
    <div className="page-content">
      <div className="grid grid--two">
        <Card
          title="Upcoming services"
          subtitle="Refine the view by status and campus"
          action={
            <div className="toolbar__filters">
              <div className="button-group" role="group" aria-label="Filter services by status">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`chip${statusFilter === filter ? " chip--active" : ""}`}
                    onClick={() => setStatusFilter(filter)}
                  >
                    {filter}
                    {filter !== "All" && <span className="caption">{statusCounts[filter]}</span>}
                  </button>
                ))}
              </div>
              <select
                className="select"
                value={campusFilter}
                onChange={(event) => setCampusFilter(event.target.value as CampusFilter)}
                aria-label="Filter services by campus"
              >
                {campusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          <ul className="list">
            {filteredServices.map((service) => (
              <li key={service.id} className="list-item">
                <button
                  type="button"
                  className={`list-interactive${
                    selectedServiceId === service.id ? " list-interactive--active" : ""
                  }`}
                  onClick={() => setSelectedServiceId(service.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <strong>{service.date}</strong>
                      <p className="card__subtitle" style={{ margin: 0 }}>
                        {service.title} — {service.theme}
                      </p>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>
                  <div className="list-item__meta">
                    <span>{service.campus}</span>
                    <span>Series: {service.title}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {filteredServices.length === 0 && (
            <div className="empty-state">No services match your filters yet.</div>
          )}
          {selectedService && (
            <div className="stat-grid">
              <div className="stat-card">
                <span className="caption">Focused service</span>
                <span className="stat-card__value">{selectedService.date}</span>
                <span className="caption">{selectedService.theme}</span>
              </div>
              <div className="stat-card">
                <span className="caption">Campus</span>
                <span className="stat-card__value">{selectedService.campus}</span>
                <span className="caption">Status: {selectedService.status}</span>
              </div>
            </div>
          )}
        </Card>
        <Card
          title="Weekly digest"
          subtitle="Auto-generated summary ready to send"
          action={
            <button className="button button--sm" type="button" onClick={handleDigestShared}>
              {digestSharedAt ? "Share again" : "Mark as shared"}
            </button>
          }
        >
          {digestSharedAt && (
            <span className="caption">Shared with team at {digestSharedAt}</span>
          )}
          <div className="digest">
            {weeklyDigest.map((section) => (
              <div key={section.title} className="digest__section">
                <p className="digest__title">{section.title}</p>
                <ul className="list">
                  {section.items.map((item) => (
                    <li key={item} className="list-item">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid--three">
        <Card
          title="Outstanding tasks"
          subtitle="Check off progress as you complete work"
          action={
            <button
              className="button button--sm"
              type="button"
              onClick={() => setShowCompletedTasks((state) => !state)}
            >
              {showCompletedTasks ? "Hide completed" : "Show completed"}
            </button>
          }
        >
          <ul className="list">
            {sortedTasks.map((task) => (
              <li key={task.id} className="list-item">
                <label className="checkbox-row">
                  <span
                    className={`checkbox${task.done ? " checkbox--checked" : ""}`}
                    aria-hidden
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleTaskToggle(task.id)}
                      aria-label={`Mark ${task.description} as complete`}
                    />
                    {task.done && <span>✓</span>}
                  </span>
                  <span>{task.description}</span>
                </label>
                <div className="list-item__meta">
                  <span>{task.owner}</span>
                  <span>Due {task.due}</span>
                  <span>Status: {task.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card
          title="Recent collaboration"
          subtitle="Filter to find relevant feedback"
          action={
            <input
              className="input"
              value={commentQuery}
              onChange={(event) => setCommentQuery(event.target.value)}
              placeholder="Search notes"
              aria-label="Search comments"
            />
          }
        >
          <ul className="list">
            {filteredComments.map((comment) => (
              <li key={comment.id} className="list-item">
                <strong>{comment.author}</strong>
                <p className="card__subtitle" style={{ margin: 0 }}>{comment.excerpt}</p>
                <div className="list-item__meta">
                  <span>{comment.role}</span>
                  <span>{comment.timeAgo}</span>
                </div>
              </li>
            ))}
            {filteredComments.length === 0 && (
              <li className="list-item">
                <span className="caption">No comments match your search.</span>
              </li>
            )}
          </ul>
        </Card>
        <Card
          title="Quick actions"
          subtitle="Pin the steps you plan to do next"
          highlight
        >
          <ul className="list">
            {quickActions.map((action) => {
              const isPinned = pinnedActions.includes(action.id);
              return (
                <li key={action.id} className="list-item">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{action.label}</span>
                      <p className="card__subtitle" style={{ margin: 0 }}>{action.description}</p>
                    </div>
                    <button
                      type="button"
                      className={`button button--sm${isPinned ? "" : " button--ghost"}`}
                      onClick={() => handlePinAction(action.id)}
                    >
                      {isPinned ? "Pinned" : "Pin"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <label className="field">
            <span>Focus note</span>
            <textarea
              className="textarea"
              value={focusNotes}
              onChange={(event) => setFocusNotes(event.target.value)}
              aria-label="Planning focus notes"
            />
            <span className="caption">{focusNotes.length} characters</span>
          </label>
        </Card>
      </div>

      <Card title="Health snapshot" subtitle="Key signals from the last month">
        <div className="stat-grid">
          {analyticsHighlights.map((highlight) => (
            <div key={highlight.label} className="stat-card">
              <span className="caption">{highlight.label}</span>
              <span className="stat-card__value">{highlight.value}</span>
              <span className="caption">{highlight.description}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

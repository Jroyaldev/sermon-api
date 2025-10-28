"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import { analyticsHighlights, suggestedSongs } from "../../data/mock-data";

type Timeframe = "4w" | "12w" | "ytd";
type FocusArea = "preparation" | "volunteers" | "music";

type Metric = {
  label: string;
  value: string;
  description: string;
};

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  "4w": "Last 4 weeks",
  "12w": "Last 12 weeks",
  ytd: "Year to date",
};

export default function InsightsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("4w");
  const [focusArea, setFocusArea] = useState<FocusArea>("preparation");
  const [includeVolunteerReminders, setIncludeVolunteerReminders] = useState(true);

  const adjustedMetrics = useMemo<Metric[]>(() => {
    const timeframeFactor: Record<Timeframe, number> = {
      "4w": 1,
      "12w": 0.94,
      ytd: 0.9,
    };

    return analyticsHighlights.map((highlight) => {
      const numeric = parseFloat(highlight.value);
      const factor = timeframeFactor[timeframe];
      let adjustedValue = highlight.value;
      if (!Number.isNaN(numeric)) {
        let result = Math.round(numeric * factor);
        if (focusArea === "volunteers" && highlight.label === "Volunteer Health") {
          result = Math.min(100, result + 4);
        }
        if (focusArea === "music" && highlight.label === "Song Diversity") {
          result = Math.min(100, result + 6);
        }
        adjustedValue = `${result}%`;
      }

      let description = highlight.description;
      if (focusArea === "preparation" && highlight.label === "Series Completion") {
        description = "Preparation pace based on recent sermon workflow.";
      }
      if (focusArea === "volunteers" && highlight.label === "Volunteer Health") {
        description = "Confirmation rate across active teams.";
      }
      if (focusArea === "music" && highlight.label === "Song Diversity") {
        description = "Unique songs introduced in the selected window.";
      }

      return {
        label: highlight.label,
        value: adjustedValue,
        description,
      };
    });
  }, [focusArea, timeframe]);

  const recommendedActions = useMemo(() => {
    const baseActions = [
      "Celebrate stories from your volunteer leads in this week's digest.",
      "Schedule a mid-week check-in with band members for setlist clarity.",
      "Share sermon talking points with communications by Thursday.",
    ];

    if (!includeVolunteerReminders) {
      return baseActions.filter((action) => !action.includes("volunteer"));
    }

    if (focusArea === "volunteers") {
      return [
        "Invite pending volunteers to a quick encouragement call.",
        ...baseActions,
      ];
    }

    if (focusArea === "music") {
      return [
        "Review transitions between reflective and celebratory songs.",
        ...baseActions,
      ];
    }

    return baseActions;
  }, [focusArea, includeVolunteerReminders]);

  return (
    <div className="page-content">
      <Card
        title="Insights overview"
        subtitle={`Key signals • ${TIMEFRAME_LABELS[timeframe]}`}
        action={
          <div className="button-group" role="group" aria-label="Select timeframe">
            {Object.entries(TIMEFRAME_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`chip${timeframe === key ? " chip--active" : ""}`}
                onClick={() => setTimeframe(key as Timeframe)}
              >
                {label}
              </button>
            ))}
          </div>
        }
      >
        <div className="toolbar__filters" style={{ justifyContent: "space-between" }}>
          <div className="button-group" role="group" aria-label="Select focus area">
            {(["preparation", "volunteers", "music"] as FocusArea[]).map((area) => (
              <button
                key={area}
                type="button"
                className={`chip${focusArea === area ? " chip--active" : ""}`}
                onClick={() => setFocusArea(area)}
              >
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </button>
            ))}
          </div>
          <label className="checkbox-row">
            <span
              className={`checkbox${includeVolunteerReminders ? " checkbox--checked" : ""}`}
              aria-hidden
            >
              <input
                type="checkbox"
                checked={includeVolunteerReminders}
                onChange={(event) => setIncludeVolunteerReminders(event.target.checked)}
                aria-label="Include volunteer reminders"
              />
              {includeVolunteerReminders && <span>✓</span>}
            </span>
            <span>Include volunteer reminders</span>
          </label>
        </div>

        <div className="stat-grid">
          {adjustedMetrics.map((metric) => (
            <div key={metric.label} className="stat-card">
              <span className="caption">{metric.label}</span>
              <span className="stat-card__value">{metric.value}</span>
              <span className="caption">{metric.description}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Activity breakdown" subtitle="Last update based on team inputs">
        <table className="table">
          <thead>
            <tr>
              <th align="left">Metric</th>
              <th align="left">Status</th>
              <th align="left">Trend</th>
            </tr>
          </thead>
          <tbody>
            {adjustedMetrics.map((metric) => (
              <tr key={metric.label}>
                <td>{metric.label}</td>
                <td>{metric.value}</td>
                <td>
                  {focusArea === "music" && metric.label === "Song Diversity"
                    ? "Trending up"
                    : focusArea === "volunteers" && metric.label === "Volunteer Health"
                    ? "Holding steady"
                    : "On track"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Next best actions" subtitle="Curated suggestions based on selections" highlight>
        <ul className="list">
          {recommendedActions.map((action) => (
            <li key={action} className="list-item">
              <span>{action}</span>
            </li>
          ))}
        </ul>
        <div className="stat-grid">
          {suggestedSongs.slice(0, 2).map((song) => (
            <div key={song.id} className="stat-card">
              <span className="caption">Song idea</span>
              <span className="stat-card__value">{song.title}</span>
              <span className="caption">{song.reason}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

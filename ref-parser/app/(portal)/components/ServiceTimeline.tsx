import type { ServiceSegment } from "../../data/mock-data";
import StatusPill from "./StatusPill";

interface ServiceTimelineProps {
  segments: ServiceSegment[];
  onMove?: (segmentId: string, direction: "up" | "down") => void;
  onAdjustDuration?: (segmentId: string, delta: number) => void;
  onStatusChange?: (segmentId: string, status: ServiceSegment["status"]) => void;
  onFocusSegment?: (segmentId: string) => void;
}

export default function ServiceTimeline({
  segments,
  onMove,
  onAdjustDuration,
  onStatusChange,
  onFocusSegment,
}: ServiceTimelineProps) {
  const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);

  return (
    <div className="service-timeline" role="list" aria-label="Service timeline">
      {segments.map((segment, index) => (
        <article key={segment.id} className="service-segment" role="listitem">
          <div>
            <div className="segment__title">{segment.title}</div>
            <div className="segment__meta">
              <StatusPill status={segment.status} />
              <span>{segment.duration} min</span>
              <span>Lead: {segment.owner}</span>
            </div>
            <p className="segment__notes">{segment.notes}</p>
            <div className="segment__controls">
              <div className="segment__control-row">
                <button
                  className="button button--sm"
                  type="button"
                  onClick={() => onFocusSegment?.(segment.id)}
                >
                  Focus segment
                </button>
                <button
                  className="button button--sm"
                  type="button"
                  onClick={() => onMove?.(segment.id, "up")}
                  disabled={!onMove || index === 0}
                >
                  Move up
                </button>
                <button
                  className="button button--sm"
                  type="button"
                  onClick={() => onMove?.(segment.id, "down")}
                  disabled={!onMove || index === segments.length - 1}
                >
                  Move down
                </button>
              </div>
              <div className="segment__control-row">
                <span className="caption">Adjust duration</span>
                <div className="button-group">
                  <button
                    className="button button--sm"
                    type="button"
                    onClick={() => onAdjustDuration?.(segment.id, -1)}
                    disabled={!onAdjustDuration || segment.duration <= 1}
                  >
                    −1 min
                  </button>
                  <button
                    className="button button--sm"
                    type="button"
                    onClick={() => onAdjustDuration?.(segment.id, 1)}
                    disabled={!onAdjustDuration}
                  >
                    +1 min
                  </button>
                </div>
              </div>
              <label className="field">
                <span>Status</span>
                <select
                  className="select"
                  value={segment.status}
                  onChange={(event) =>
                    onStatusChange?.(
                      segment.id,
                      event.target.value as ServiceSegment["status"],
                    )
                  }
                >
                  <option value="Planned">Planned</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Live">Live</option>
                </select>
              </label>
            </div>
          </div>
          <div>
            <p className="section-title">Volunteers</p>
            <ul className="list">
              {segment.volunteers.map((volunteer) => (
                <li key={`${segment.id}-${volunteer.role}`} className="list-item">
                  <span>{volunteer.name}</span>
                  <span className="list-item__meta">{volunteer.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
      <div className="empty-state" aria-label="Total duration">
        Total duration: {totalDuration} minutes
      </div>
    </div>
  );
}

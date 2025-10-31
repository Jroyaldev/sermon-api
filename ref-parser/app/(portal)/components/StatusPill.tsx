const STATUS_MAP = {
  Planned: { label: "Planned", className: "badge badge--neutral" },
  Confirmed: { label: "Confirmed", className: "badge badge--review" },
  Live: { label: "Live", className: "badge badge--finalized" },
} as const;

type StatusKey = keyof typeof STATUS_MAP;

export default function StatusPill({ status }: { status: StatusKey }) {
  const statusInfo = STATUS_MAP[status];
  return <span className={statusInfo.className}>{statusInfo.label}</span>;
}

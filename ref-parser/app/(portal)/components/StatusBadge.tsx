import type { ServiceStatus } from "../../data/mock-data";

const STATUS_CLASS: Record<ServiceStatus, string> = {
  Draft: "badge badge--draft",
  "In Review": "badge badge--review",
  Finalized: "badge badge--finalized",
};

export default function StatusBadge({ status }: { status: ServiceStatus }) {
  return <span className={STATUS_CLASS[status]}>{status}</span>;
}

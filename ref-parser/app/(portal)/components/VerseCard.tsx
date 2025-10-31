import type { Verse } from "../../data/mock-data";

export default function VerseCard({ verse }: { verse: Verse }) {
  return (
    <div className="sidebar__inspiration">
      <span className="caption">Weekly verse</span>
      <strong>{verse.reference}</strong>
      <p style={{ margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>“{verse.text}”</p>
    </div>
  );
}

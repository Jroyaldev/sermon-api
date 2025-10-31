import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  highlight?: boolean;
}

export default function Card({
  title,
  subtitle,
  action,
  children,
  highlight = false,
}: CardProps) {
  return (
    <section className={`card${highlight ? " card--highlight" : ""}`}>
      {(title || action) && (
        <div className="card__header">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

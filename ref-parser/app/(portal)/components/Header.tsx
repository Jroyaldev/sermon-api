"use client";

import { useMemo, useState } from "react";
import { focusSnapshot, quickActions } from "../../data/mock-data";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPalette, setShowPalette] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const progress = focusSnapshot.preparationProgress;

  const filteredActions = useMemo(() => {
    if (!searchTerm.trim()) {
      return quickActions.slice(0, 3);
    }

    return quickActions
      .filter((action) => {
        const normalized = `${action.label} ${action.description}`.toLowerCase();
        return normalized.includes(searchTerm.toLowerCase());
      })
      .slice(0, 5);
  }, [searchTerm]);

  const handleQuickAction = (label: string) => {
    setLastAction(label);
    setSearchTerm("");
    setShowPalette(false);
  };

  return (
    <header className="portal-header">
      <div className="portal-header__greeting">
        <h1 className="portal-header__title">Pastor Portal</h1>
        <p className="portal-header__subtitle">
          {focusSnapshot.currentSeries} • {focusSnapshot.currentWeek}
        </p>
        <div className="progress-bar" aria-label="Preparation progress">
          <div className="progress-bar__track">
            <div
              className="progress-bar__value"
              style={{ transform: `scaleX(${progress / 100})` }}
              aria-hidden
            />
          </div>
          <span className="caption">Preparation {progress}% complete</span>
          {lastAction && (
            <span className="caption">Last quick action: {lastAction}</span>
          )}
        </div>
      </div>

      <div className="portal-header__actions">
        <div className="command-search" role="search">
          <input
            className="input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Find anything…"
            aria-label="Search quick actions"
          />
          {searchTerm && (
            <div className="command-search__results" role="listbox">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className="command-search__button"
                    onClick={() => handleQuickAction(action.label)}
                  >
                    <strong>{action.label}</strong>
                    <span className="caption">{action.description}</span>
                  </button>
                ))
              ) : (
                <span className="caption">No actions found</span>
              )}
            </div>
          )}
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => handleQuickAction("New item created")}
        >
          New item
        </button>
        <button
          className="button button--ghost"
          type="button"
          onClick={() => setShowPalette((state) => !state)}
          aria-expanded={showPalette}
          aria-controls="command-palette"
        >
          {showPalette ? "Hide shortcuts" : "Open shortcuts"}
        </button>
      </div>

      {showPalette && (
        <div id="command-palette" className="command-palette" role="dialog">
          <div className="command-palette__header">
            <span>Quick create</span>
            <span className="caption">Choose an action to focus on</span>
          </div>
          <div className="command-palette__list">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="command-palette__item"
                onClick={() => handleQuickAction(action.label)}
              >
                <strong>{action.label}</strong>
                <span>{action.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";
import Card from "../components/Card";

type TeamMember = { name: string; role: string; email: string };

type ProfileState = {
  churchName: string;
  accentColor: string;
  primaryCampus: string;
  communicationEmail: string;
};

const INITIAL_TEAM: TeamMember[] = [
  { name: "Pastor Daniel", role: "Admin", email: "daniel@gracecity.church" },
  { name: "Jamie Rivera", role: "Editor", email: "jamie@gracecity.church" },
  { name: "Marcus Lee", role: "Editor", email: "marcus@gracecity.church" },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileState>({
    churchName: "Grace City Church",
    accentColor: "#111111",
    primaryCampus: "Downtown",
    communicationEmail: "info@gracecity.church",
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [newMember, setNewMember] = useState<TeamMember>({ name: "", role: "Viewer", email: "" });
  const [enableReminders, setEnableReminders] = useState(true);
  const [autoDigest, setAutoDigest] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);

  const updateProfile = (updates: Partial<ProfileState>) => {
    setProfile((previous) => ({ ...previous, ...updates }));
  };

  const addTeamMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      return;
    }
    setTeamMembers((previous) => [...previous, { ...newMember, name: newMember.name.trim(), email: newMember.email.trim() }]);
    setNewMember({ name: "", role: "Viewer", email: "" });
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers((previous) => previous.filter((member) => member.email !== email));
  };

  return (
    <div className="page-content">
      <Card title="Church profile" subtitle="Manage branding and contact details">
        <div className="grid grid--two">
          <label className="field">
            <span>Church name</span>
            <input
              className="input"
              value={profile.churchName}
              onChange={(event) => updateProfile({ churchName: event.target.value })}
              aria-label="Church name"
            />
          </label>
          <label className="field">
            <span>Accent color</span>
            <input
              className="input"
              type="color"
              value={profile.accentColor}
              onChange={(event) => updateProfile({ accentColor: event.target.value })}
              aria-label="Accent color"
            />
          </label>
          <label className="field">
            <span>Primary campus</span>
            <input
              className="input"
              value={profile.primaryCampus}
              onChange={(event) => updateProfile({ primaryCampus: event.target.value })}
              aria-label="Primary campus"
            />
          </label>
          <label className="field">
            <span>Communication email</span>
            <input
              className="input"
              value={profile.communicationEmail}
              onChange={(event) => updateProfile({ communicationEmail: event.target.value })}
              aria-label="Communication email"
            />
          </label>
        </div>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="caption">Preview accent</span>
            <span
              className="stat-card__value"
              style={{ color: profile.accentColor }}
            >
              ●
            </span>
            <span className="caption">Monochrome theme keeps the UI calm.</span>
          </div>
        </div>
      </Card>

      <Card
        title="Team roles"
        subtitle="Invite leaders and manage permissions"
        action={
          <div className="button-group">
            <button
              className="button button--sm"
              type="button"
              onClick={addTeamMember}
              disabled={!newMember.name.trim() || !newMember.email.trim()}
            >
              Invite member
            </button>
            <button
              className="button button--sm button--ghost"
              type="button"
              onClick={() => setTeamMembers(INITIAL_TEAM)}
            >
              Reset list
            </button>
          </div>
        }
      >
        <div className="grid grid--two">
          <label className="field">
            <span>Full name</span>
            <input
              className="input"
              value={newMember.name}
              onChange={(event) => setNewMember((previous) => ({ ...previous, name: event.target.value }))}
              aria-label="New member name"
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              value={newMember.email}
              onChange={(event) => setNewMember((previous) => ({ ...previous, email: event.target.value }))}
              aria-label="New member email"
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select
              className="select"
              value={newMember.role}
              onChange={(event) => setNewMember((previous) => ({ ...previous, role: event.target.value }))}
              aria-label="New member role"
            >
              <option value="Viewer">Viewer</option>
              <option value="Contributor">Contributor</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
        <ul className="list">
          {teamMembers.map((member) => (
            <li key={member.email} className="list-item">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{member.name}</span>
                  <p className="card__subtitle" style={{ margin: 0 }}>{member.email}</p>
                </div>
                <div className="button-group">
                  <span className="tag">{member.role}</span>
                  <button
                    className="button button--sm button--ghost"
                    type="button"
                    onClick={() => removeTeamMember(member.email)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Automation" subtitle="Fine-tune reminders and digests" highlight>
        <div className="list">
          <label className="checkbox-row">
            <span className={`checkbox${enableReminders ? " checkbox--checked" : ""}`} aria-hidden>
              <input
                type="checkbox"
                checked={enableReminders}
                onChange={(event) => setEnableReminders(event.target.checked)}
                aria-label="Enable volunteer reminders"
              />
              {enableReminders && <span>✓</span>}
            </span>
            <span>Send gentle volunteer reminders 48 hours out</span>
          </label>
          <label className="checkbox-row">
            <span className={`checkbox${autoDigest ? " checkbox--checked" : ""}`} aria-hidden>
              <input
                type="checkbox"
                checked={autoDigest}
                onChange={(event) => setAutoDigest(event.target.checked)}
                aria-label="Enable weekly digest"
              />
              {autoDigest && <span>✓</span>}
            </span>
            <span>Auto-send weekly digest to staff each Friday</span>
          </label>
          <label className="checkbox-row">
            <span className={`checkbox${sandboxMode ? " checkbox--checked" : ""}`} aria-hidden>
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={(event) => setSandboxMode(event.target.checked)}
                aria-label="Enable sandbox mode"
              />
              {sandboxMode && <span>✓</span>}
            </span>
            <span>Sandbox planning mode for experimenting safely</span>
          </label>
        </div>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="caption">Reminders</span>
            <span className="stat-card__value">{enableReminders ? "On" : "Off"}</span>
            <span className="caption">Volunteers receive a summary email.</span>
          </div>
          <div className="stat-card">
            <span className="caption">Weekly digest</span>
            <span className="stat-card__value">{autoDigest ? "Scheduled" : "Manual"}</span>
            <span className="caption">Fridays at 2pm local time.</span>
          </div>
          <div className="stat-card">
            <span className="caption">Sandbox mode</span>
            <span className="stat-card__value">{sandboxMode ? "Enabled" : "Off"}</span>
            <span className="caption">Use for run-throughs without alerts.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import {
  volunteerAnnouncements as defaultAnnouncements,
  volunteerAssignments as defaultAssignments,
} from "../../data/mock-data";
import type { VolunteerAssignment } from "../../data/mock-data";

const STATUS_BADGE_CLASS: Record<VolunteerAssignment["status"], string> = {
  Confirmed: "badge badge--finalized",
  Pending: "badge badge--review",
  Declined: "badge badge--draft",
};

type StatusFilter = "All" | VolunteerAssignment["status"];
type TeamFilter = "All" | string;

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState(defaultAssignments);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(
    defaultAssignments[0]?.id ?? null,
  );
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [contactLog, setContactLog] = useState<string[]>([]);

  const teamOptions = useMemo(() => {
    const teams = new Set<string>();
    defaultAssignments.forEach((assignment) => teams.add(assignment.team));
    return ["All", ...Array.from(teams)] as TeamFilter[];
  }, []);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((assignment) => {
      const matchesStatus = statusFilter === "All" || assignment.status === statusFilter;
      const matchesTeam = teamFilter === "All" || assignment.team === teamFilter;
      const matchesSearch = `${assignment.name} ${assignment.role} ${assignment.contact}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesTeam && matchesSearch;
    });
  }, [searchTerm, statusFilter, teamFilter, volunteers]);

  const selectedVolunteer = useMemo(
    () => volunteers.find((assignment) => assignment.id === selectedVolunteerId) ?? null,
    [selectedVolunteerId, volunteers],
  );

  const updateStatus = (id: string, status: VolunteerAssignment["status"]) => {
    setVolunteers((previous) =>
      previous.map((assignment) =>
        assignment.id === id ? { ...assignment, status } : assignment,
      ),
    );
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.trim()) {
      return;
    }
    setAnnouncements((previous) => [newAnnouncement.trim(), ...previous]);
    setNewAnnouncement("");
  };

  const logContact = (assignment: VolunteerAssignment) => {
    const timestamp = new Date().toLocaleTimeString();
    setContactLog((previous) => [
      `${assignment.name} (${assignment.team}) contacted at ${timestamp}`,
      ...previous,
    ]);
    updateStatus(assignment.id, "Confirmed");
  };

  return (
    <div className="page-content">
      <Card
        title="Volunteer roster"
        subtitle="Filter and confirm this Sunday's team"
        action={
          <div className="toolbar__filters">
            <input
              className="input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name or role"
              aria-label="Search volunteers"
            />
            <select
              className="select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              aria-label="Filter by status"
            >
              <option value="All">Status: All</option>
              <option value="Confirmed">Status: Confirmed</option>
              <option value="Pending">Status: Pending</option>
              <option value="Declined">Status: Declined</option>
            </select>
            <select
              className="select"
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value as TeamFilter)}
              aria-label="Filter by team"
            >
              {teamOptions.map((team) => (
                <option key={team} value={team}>
                  Team: {team}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <table className="table">
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Role</th>
              <th align="left">Team</th>
              <th align="left">Status</th>
              <th align="left">Contact</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.name}</td>
                <td>{assignment.role}</td>
                <td>{assignment.team}</td>
                <td>
                  <span className={STATUS_BADGE_CLASS[assignment.status]}>{assignment.status}</span>
                </td>
                <td>
                  <a href={`mailto:${assignment.contact}`}>{assignment.contact}</a>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="button button--sm"
                      type="button"
                      onClick={() => setSelectedVolunteerId(assignment.id)}
                    >
                      View
                    </button>
                    <button
                      className="button button--sm"
                      type="button"
                      onClick={() => updateStatus(assignment.id, "Confirmed")}
                      disabled={assignment.status === "Confirmed"}
                    >
                      Confirm
                    </button>
                    <button
                      className="button button--sm button--ghost"
                      type="button"
                      onClick={() => updateStatus(assignment.id, "Declined")}
                    >
                      Decline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredVolunteers.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <span className="caption">No volunteers match those filters.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="grid grid--two">
        <Card title="Volunteer spotlight" subtitle="Send encouragement and log confirmations">
          {selectedVolunteer ? (
            <div className="list">
              <div className="list-item">
                <span className="caption">Name</span>
                <strong>{selectedVolunteer.name}</strong>
              </div>
              <div className="list-item">
                <span className="caption">Role</span>
                <span>{selectedVolunteer.role}</span>
              </div>
              <div className="list-item">
                <span className="caption">Team</span>
                <span>{selectedVolunteer.team}</span>
              </div>
              <div className="list-item">
                <span className="caption">Notes</span>
                <span>{selectedVolunteer.notes ?? "No additional notes"}</span>
              </div>
              <div className="button-group">
                <button
                  className="button button--sm"
                  type="button"
                  onClick={() => updateStatus(selectedVolunteer.id, "Confirmed")}
                  disabled={selectedVolunteer.status === "Confirmed"}
                >
                  Mark confirmed
                </button>
                <button
                  className="button button--sm"
                  type="button"
                  onClick={() => logContact(selectedVolunteer)}
                >
                  Log check-in
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">Select a volunteer from the roster to view details.</div>
          )}
        </Card>

        <Card title="Team notes" subtitle="Help your volunteers feel supported" highlight>
          <ul className="list">
            {announcements.map((announcement) => (
              <li key={announcement} className="list-item">
                <span>{announcement}</span>
              </li>
            ))}
          </ul>
          <label className="field">
            <span>New announcement</span>
            <textarea
              className="textarea"
              value={newAnnouncement}
              onChange={(event) => setNewAnnouncement(event.target.value)}
              placeholder="Share rehearsal reminders or celebrations"
              aria-label="New team announcement"
            />
          </label>
          <button className="button button--primary" type="button" onClick={addAnnouncement}>
            Add update
          </button>
        </Card>
      </div>

      <Card title="Contact log" subtitle="Track who you've checked in with this week">
        <ul className="list">
          {contactLog.map((entry, index) => (
            <li key={`${entry}-${index}`} className="list-item">
              <span>{entry}</span>
            </li>
          ))}
          {contactLog.length === 0 && (
            <li className="list-item">
              <span className="caption">No outreach logged yet.</span>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}

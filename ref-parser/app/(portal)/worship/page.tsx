"use client";

import { useMemo, useState } from "react";
import Card from "../components/Card";
import { songLibrary, suggestedSongs } from "../../data/mock-data";
import type { SongItem } from "../../data/mock-data";

type TempoFilter = "All" | SongItem["tempo"];
type EnergyFilter = "All" | SongItem["energy"];

type FamiliarityCounts = Record<SongItem["familiarity"], number>;
type EnergyCounts = Record<SongItem["energy"], number>;

const TEMPO_OPTIONS: TempoFilter[] = ["All", "Slow", "Mid", "Up"];
const ENERGY_OPTIONS: EnergyFilter[] = ["All", "Reflective", "Celebratory", "Anthem"];

export default function WorshipPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempoFilter, setTempoFilter] = useState<TempoFilter>("All");
  const [energyFilter, setEnergyFilter] = useState<EnergyFilter>("All");
  const [setlist, setSetlist] = useState<SongItem[]>(songLibrary.slice(0, 3));
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const filteredSongs = useMemo(() => {
    return songLibrary.filter((song) => {
      const matchesSearch = `${song.title} ${song.key}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTempo = tempoFilter === "All" || song.tempo === tempoFilter;
      const matchesEnergy = energyFilter === "All" || song.energy === energyFilter;
      return matchesSearch && matchesTempo && matchesEnergy;
    });
  }, [energyFilter, searchTerm, tempoFilter]);

  const setlistSongs = setlist;

  const energyCounts = useMemo(() => {
    return setlistSongs.reduce<EnergyCounts>(
      (accumulator, song) => {
        accumulator[song.energy] += 1;
        return accumulator;
      },
      { Reflective: 0, Celebratory: 0, Anthem: 0 },
    );
  }, [setlistSongs]);

  const familiarityCounts = useMemo(() => {
    return setlistSongs.reduce<FamiliarityCounts>(
      (accumulator, song) => {
        accumulator[song.familiarity] += 1;
        return accumulator;
      },
      { Favorite: 0, Known: 0, New: 0 },
    );
  }, [setlistSongs]);

  const addSongToSetlist = (song: SongItem) => {
    setSetlist((previous) => (previous.find((entry) => entry.id === song.id) ? previous : [...previous, song]));
  };

  const removeSongFromSetlist = (songId: string) => {
    setSetlist((previous) => previous.filter((song) => song.id !== songId));
  };

  const moveSong = (songId: string, direction: "up" | "down") => {
    setSetlist((previous) => {
      const index = previous.findIndex((song) => song.id === songId);
      if (index === -1) {
        return previous;
      }
      const target = direction === "up" ? Math.max(0, index - 1) : Math.min(previous.length - 1, index + 1);
      if (target === index) {
        return previous;
      }
      const next = [...previous];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const handleSuggestionAdd = (suggestionId: string) => {
    const suggestion = suggestedSongs.find((item) => item.id === suggestionId);
    if (!suggestion) {
      return;
    }

    addSongToSetlist({
      id: suggestion.id,
      title: suggestion.title,
      key: "—",
      tempo: "Mid",
      energy: "Reflective",
      familiarity: "New",
      lastUsed: "New",
    });
  };

  return (
    <div className="page-content">
      <Card
        title="Song library"
        subtitle="Search and filter to curate this week's set"
        action={
          <div className="toolbar__filters">
            <input
              className="input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title or key"
              aria-label="Search songs"
            />
            <select
              className="select"
              value={tempoFilter}
              onChange={(event) => setTempoFilter(event.target.value as TempoFilter)}
              aria-label="Filter by tempo"
            >
              {TEMPO_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Tempo: {option}
                </option>
              ))}
            </select>
            <select
              className="select"
              value={energyFilter}
              onChange={(event) => setEnergyFilter(event.target.value as EnergyFilter)}
              aria-label="Filter by energy"
            >
              {ENERGY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  Energy: {option}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <table className="table">
          <thead>
            <tr>
              <th align="left">Song</th>
              <th align="left">Key</th>
              <th align="left">Tempo</th>
              <th align="left">Energy</th>
              <th align="left">Familiarity</th>
              <th align="left">Last Used</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSongs.map((song) => {
              const isInSetlist = setlistSongs.some((entry) => entry.id === song.id);
              return (
                <tr key={song.id}>
                  <td>{song.title}</td>
                  <td>{song.key}</td>
                  <td>{song.tempo}</td>
                  <td>{song.energy}</td>
                  <td>{song.familiarity}</td>
                  <td>{song.lastUsed}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="button button--sm"
                        onClick={() => addSongToSetlist(song)}
                        disabled={isInSetlist}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="button button--sm button--ghost"
                        onClick={() => removeSongFromSetlist(song.id)}
                        disabled={!isInSetlist}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredSongs.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <span className="caption">No songs match those filters yet.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="grid grid--two">
        <Card
          title="Current setlist"
          subtitle="Drag-style controls keep order intentional"
          action={
            <div className="button-group">
              <button
                className="button button--sm"
                type="button"
                onClick={() => {
                  setSetlist([]);
                  setExportMessage(null);
                }}
                disabled={setlist.length === 0}
              >
                Clear setlist
              </button>
              <button
                className="button button--sm button--primary"
                type="button"
                onClick={() => setExportMessage(`Setlist export prepared at ${new Date().toLocaleTimeString()}`)}
                disabled={setlist.length === 0}
              >
                Export plan
              </button>
            </div>
          }
        >
          <ul className="list">
            {setlistSongs.map((song, index) => (
              <li key={song.id} className="list-item">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <strong>
                      {index + 1}. {song.title}
                    </strong>
                    <p className="card__subtitle" style={{ margin: 0 }}>
                      {song.key} • {song.energy} • {song.familiarity}
                    </p>
                  </div>
                  <div className="button-group">
                    <button
                      className="button button--sm"
                      type="button"
                      onClick={() => moveSong(song.id, "up")}
                      disabled={index === 0}
                    >
                      Up
                    </button>
                    <button
                      className="button button--sm"
                      type="button"
                      onClick={() => moveSong(song.id, "down")}
                      disabled={index === setlistSongs.length - 1}
                    >
                      Down
                    </button>
                    <button
                      className="button button--sm button--ghost"
                      type="button"
                      onClick={() => removeSongFromSetlist(song.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {setlistSongs.length === 0 && (
              <li className="list-item">
                <span className="caption">Add songs from the library to build your set.</span>
              </li>
            )}
          </ul>
          {exportMessage && <span className="caption">{exportMessage}</span>}
        </Card>

        <Card title="Setlist insights" subtitle="Balance energy and familiarity" highlight>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="caption">Reflective</span>
              <span className="stat-card__value">{energyCounts.Reflective}</span>
              <span className="caption">Songs in quiet moments</span>
            </div>
            <div className="stat-card">
              <span className="caption">Celebratory</span>
              <span className="stat-card__value">{energyCounts.Celebratory}</span>
              <span className="caption">Lift the room</span>
            </div>
            <div className="stat-card">
              <span className="caption">Anthem</span>
              <span className="stat-card__value">{energyCounts.Anthem}</span>
              <span className="caption">Big declarations</span>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="caption">Favorites</span>
              <span className="stat-card__value">{familiarityCounts.Favorite}</span>
            </div>
            <div className="stat-card">
              <span className="caption">Known</span>
              <span className="stat-card__value">{familiarityCounts.Known}</span>
            </div>
            <div className="stat-card">
              <span className="caption">New</span>
              <span className="stat-card__value">{familiarityCounts.New}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Smart suggestions" subtitle="Add contextual songs quickly">
        <ul className="list">
          {suggestedSongs.map((suggestion) => (
            <li key={suggestion.id} className="list-item">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{suggestion.title}</span>
                  <p className="card__subtitle" style={{ margin: 0 }}>{suggestion.reason}</p>
                </div>
                <button
                  className="button button--sm"
                  type="button"
                  onClick={() => handleSuggestionAdd(suggestion.id)}
                >
                  Add to setlist
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

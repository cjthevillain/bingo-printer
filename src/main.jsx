import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Printer,
  RefreshCw,
  RotateCcw,
  Shuffle,
  SlidersHorizontal
} from "lucide-react";
import "./styles.css";

const DEFAULT_RANGES = [
  { label: "B", min: 1, max: 15 },
  { label: "I", min: 16, max: 30 },
  { label: "N", min: 31, max: 45 },
  { label: "G", min: 46, max: 60 },
  { label: "O", min: 61, max: 75 }
];

const DEFAULT_CUSTOM_ITEMS = [
  "First prize",
  "Lucky number",
  "Center square",
  "Family",
  "Music",
  "Game night",
  "Snack break",
  "Winner",
  "Door prize",
  "Laugh",
  "Photo",
  "Team",
  "Bonus",
  "Round two",
  "Friends",
  "Celebration",
  "High five",
  "Ticket",
  "Table",
  "Caller",
  "Blackout",
  "Line bingo",
  "Corner",
  "Almost",
  "Prize table",
  "Good luck",
  "Final round",
  "Spotlight"
].join("\n");

function createRandom(seedText) {
  let seed = 2166136261;

  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return function random() {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clampNumber(value, min, max) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.round(numericValue)));
}

function shuffle(values, random) {
  const copy = [...values];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function parseHeader(headerText) {
  const clean = headerText.replace(/\s/g, "").toUpperCase();
  const fallback = "BINGO";
  const source = clean.length >= 5 ? clean : `${clean}${fallback}`;
  return source.slice(0, 5).split("");
}

function parseCustomItems(text) {
  return text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeRanges(ranges, freeCenter) {
  return ranges.map((range, index) => {
    const min = clampNumber(range.min, 0, 999);
    const max = clampNumber(range.max, min, 999);
    const needed = freeCenter && index === 2 ? 4 : 5;
    const adjustedMax = Math.max(max, min + needed - 1);

    return {
      label: parseHeader(range.label || DEFAULT_RANGES[index].label)[0],
      min,
      max: adjustedMax
    };
  });
}

function makeNumberCard(settings, cardIndex) {
  const random = createRandom(`${settings.seed}:card:${cardIndex}`);
  const ranges = normalizeRanges(settings.ranges, settings.freeCenter);
  const rows = Array.from({ length: 5 }, () => Array(5).fill(""));

  ranges.forEach((range, columnIndex) => {
    const numbers = [];

    for (let number = range.min; number <= range.max; number += 1) {
      numbers.push(number);
    }

    const picksNeeded = settings.freeCenter && columnIndex === 2 ? 4 : 5;
    const picks = shuffle(numbers, random).slice(0, picksNeeded);
    let pickIndex = 0;

    for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
      if (settings.freeCenter && rowIndex === 2 && columnIndex === 2) {
        rows[rowIndex][columnIndex] = settings.freeText;
      } else {
        rows[rowIndex][columnIndex] = String(picks[pickIndex]);
        pickIndex += 1;
      }
    }
  });

  return rows;
}

function makeCustomCard(settings, cardIndex) {
  const random = createRandom(`${settings.seed}:custom:${cardIndex}`);
  const rows = Array.from({ length: 5 }, () => Array(5).fill(""));
  const allItems = parseCustomItems(settings.customItems);
  const needed = settings.freeCenter ? 24 : 25;
  const pool = allItems.length >= needed
    ? shuffle(allItems, random).slice(0, needed)
    : shuffle([...allItems, ...DEFAULT_CUSTOM_ITEMS.split("\n")], random).slice(0, needed);
  let itemIndex = 0;

  for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < 5; columnIndex += 1) {
      if (settings.freeCenter && rowIndex === 2 && columnIndex === 2) {
        rows[rowIndex][columnIndex] = settings.freeText;
      } else {
        rows[rowIndex][columnIndex] = pool[itemIndex] || "";
        itemIndex += 1;
      }
    }
  }

  return rows;
}

function makeCards(settings) {
  const count = clampNumber(settings.count, 1, 250);

  return Array.from({ length: count }, (_, index) => ({
    id: `${settings.seed}-${index}`,
    index,
    cells: settings.mode === "custom"
      ? makeCustomCard(settings, index)
      : makeNumberCard(settings, index)
  }));
}

function updateRange(ranges, index, patch) {
  return ranges.map((range, rangeIndex) => {
    if (rangeIndex !== index) {
      return range;
    }

    return {
      ...range,
      ...patch
    };
  });
}

function BingoCard({ card, settings, headers }) {
  return (
    <article className="print-page" aria-label={`Bingo card ${card.index + 1}`}>
      <section className="bingo-card">
        <div className="bingo-header" aria-hidden="true">
          {headers.map((letter, index) => (
            <span key={`${letter}-${index}`}>{letter}</span>
          ))}
        </div>

        <div className="bingo-grid">
          {card.cells.map((row, rowIndex) => row.map((cell, columnIndex) => {
            const isFree = settings.freeCenter && rowIndex === 2 && columnIndex === 2;
            const textCell = settings.mode === "custom" && !isFree;

            return (
              <div
                className={`bingo-cell ${isFree ? "free-cell" : ""} ${textCell ? "text-cell" : ""}`}
                key={`${rowIndex}-${columnIndex}`}
              >
                {isFree ? (
                  <span className="free-mark">
                    <strong>{settings.freeText}</strong>
                  </span>
                ) : (
                  <span>{cell}</span>
                )}
              </div>
            );
          }))}
        </div>
      </section>

      {settings.footerText ? (
        <footer className="page-footer">
          <span>{settings.footerText}</span>
        </footer>
      ) : null}
    </article>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function App() {
  const [settings, setSettings] = useState({
    count: 20,
    seed: "BINGO-2026",
    headerText: "BINGO",
    freeText: "FREE",
    footerText: "",
    mode: "numbers",
    freeCenter: true,
    showAdvancedRanges: false,
    customItems: DEFAULT_CUSTOM_ITEMS,
    ranges: DEFAULT_RANGES
  });

  const headers = useMemo(() => parseHeader(settings.headerText), [settings.headerText]);
  const cards = useMemo(() => makeCards(settings), [settings]);

  function setSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
  }

  function randomizeSeed() {
    setSettings((current) => ({
      ...current,
      seed: `BINGO-${Date.now().toString(36).toUpperCase()}`
    }));
  }

  function resetSettings() {
    setSettings({
      count: 20,
      seed: "BINGO-2026",
      headerText: "BINGO",
      freeText: "FREE",
      footerText: "",
      mode: "numbers",
      freeCenter: true,
      showAdvancedRanges: false,
      customItems: DEFAULT_CUSTOM_ITEMS,
      ranges: DEFAULT_RANGES
    });
  }

  return (
    <main className="app-shell">
      <aside className="control-panel" aria-label="Bingo card controls">
        <div className="panel-title">
          <div>
            <p>Bingo Printer</p>
            <span>Letter, black and white</span>
          </div>
          <SlidersHorizontal aria-hidden="true" />
        </div>

        <div className="button-row">
          <button className="primary-button" type="button" onClick={() => window.print()} title="Print cards">
            <Printer size={18} aria-hidden="true" />
            Print
          </button>
          <button type="button" onClick={randomizeSeed} title="Randomize every card">
            <Shuffle size={18} aria-hidden="true" />
            Randomize
          </button>
          <button type="button" onClick={resetSettings} title="Reset controls">
            <RotateCcw size={18} aria-hidden="true" />
            Reset
          </button>
        </div>

        <div className="control-grid">
          <Field label="Cards">
            <input
              min="1"
              max="250"
              type="number"
              value={settings.count}
              onChange={(event) => setSetting("count", clampNumber(event.target.value, 1, 250))}
            />
          </Field>

          <Field label="Header">
            <input
              maxLength="12"
              value={settings.headerText}
              onChange={(event) => setSetting("headerText", event.target.value)}
            />
          </Field>

          <Field label="Free space">
            <input
              maxLength="18"
              value={settings.freeText}
              onChange={(event) => setSetting("freeText", event.target.value)}
            />
          </Field>

          <Field label="Footer">
            <input
              maxLength="48"
              placeholder="Optional"
              value={settings.footerText}
              onChange={(event) => setSetting("footerText", event.target.value)}
            />
          </Field>
        </div>

        <label className="field">
          <span>Seed</span>
          <div className="seed-row">
            <input
              value={settings.seed}
              onChange={(event) => setSetting("seed", event.target.value)}
            />
            <button className="icon-button" type="button" onClick={randomizeSeed} title="New seed">
              <RefreshCw size={18} aria-hidden="true" />
            </button>
          </div>
        </label>

        <div className="segmented" role="radiogroup" aria-label="Card mode">
          <button
            className={settings.mode === "numbers" ? "active" : ""}
            type="button"
            onClick={() => setSetting("mode", "numbers")}
            aria-pressed={settings.mode === "numbers"}
          >
            Numbers
          </button>
          <button
            className={settings.mode === "custom" ? "active" : ""}
            type="button"
            onClick={() => setSetting("mode", "custom")}
            aria-pressed={settings.mode === "custom"}
          >
            Custom
          </button>
        </div>

        <div className="toggle-list">
          <label>
            <input
              type="checkbox"
              checked={settings.freeCenter}
              onChange={(event) => setSetting("freeCenter", event.target.checked)}
            />
            Center free space
          </label>
        </div>

        {settings.mode === "numbers" ? (
          <>
            <button
              className="advanced-toggle"
              type="button"
              onClick={() => setSetting("showAdvancedRanges", !settings.showAdvancedRanges)}
              aria-expanded={settings.showAdvancedRanges}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
              Advanced ranges
            </button>

            {settings.showAdvancedRanges ? (
              <section className="range-panel" aria-label="Number ranges">
                <h2>Ranges</h2>
                {settings.ranges.map((range, index) => (
                  <div className="range-row" key={DEFAULT_RANGES[index].label}>
                    <input
                      className="letter-input"
                      maxLength="1"
                      value={range.label}
                      aria-label={`Column ${index + 1} letter`}
                      onChange={(event) => {
                        const nextRanges = updateRange(settings.ranges, index, {
                          label: event.target.value.toUpperCase()
                        });
                        setSetting("ranges", nextRanges);
                      }}
                    />
                    <input
                      type="number"
                      value={range.min}
                      aria-label={`${range.label} minimum`}
                      onChange={(event) => {
                        const nextRanges = updateRange(settings.ranges, index, {
                          min: clampNumber(event.target.value, 0, 999)
                        });
                        setSetting("ranges", nextRanges);
                      }}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={range.max}
                      aria-label={`${range.label} maximum`}
                      onChange={(event) => {
                        const nextRanges = updateRange(settings.ranges, index, {
                          max: clampNumber(event.target.value, 0, 999)
                        });
                        setSetting("ranges", nextRanges);
                      }}
                    />
                  </div>
                ))}
              </section>
            ) : null}
          </>
        ) : (
          <Field label="Custom cells">
            <textarea
              rows="9"
              value={settings.customItems}
              onChange={(event) => setSetting("customItems", event.target.value)}
            />
          </Field>
        )}

        <div className="print-spec">
          <span>Paper</span>
          <strong>8.5 x 11 in</strong>
          <span>Pages</span>
          <strong>{cards.length}</strong>
        </div>
      </aside>

      <section className="preview-panel" aria-label="Print preview">
        {cards.map((card) => (
          <BingoCard card={card} headers={headers} settings={settings} key={card.id} />
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

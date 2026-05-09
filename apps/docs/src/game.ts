/**
 * Blazon Docs — Heraldry Quiz
 *
 * Three game modes:
 *  1. type-name  — see a coat, type the city name
 *  2. pick-name  — see a coat, pick the city name from 4 options
 *  3. pick-coat  — see a city name, pick the correct coat from 4 options
 */

import type { CoatOfArms } from '@blazon/types';

type GameMode = 'type-name' | 'pick-name' | 'pick-coat';

// ─── Utilities ────────────────────────────────────────────────────────────

function escHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Strip "Herb " prefix that all entries carry. */
function cityLabel(coat: CoatOfArms): string {
  return coat.name.replace(/^Herb\s+/i, '');
}

/** Normalize for fuzzy comparison: lowercase, strip diacritics, keep only alphanumeric. */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function pickRandom<T>(pool: readonly T[], count: number, exclude?: T): T[] {
  const arr = exclude ? pool.filter((x) => x !== exclude) : [...pool];
  const result: T[] = [];
  while (result.length < count && arr.length > 0) {
    const idx = Math.floor(Math.random() * arr.length);
    result.push(...arr.splice(idx, 1));
  }
  return result;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

// ─── Public init ──────────────────────────────────────────────────────────

export function initGame(cityEntries: CoatOfArms[]): void {
  if (cityEntries.length < 4) return;

  const gameArea = document.getElementById('game-area') as HTMLDivElement | null;
  if (gameArea === null) return;

  // ── State ────────────────────────────────────────────────────────────
  let mode: GameMode = 'pick-name';
  let current: CoatOfArms = cityEntries[0]!;
  let options: CoatOfArms[] = [];
  let answered = false;
  let lastCorrect = false;
  let selectedId: string | null = null;
  let score = { correct: 0, total: 0, streak: 0 };

  // ── Score display ────────────────────────────────────────────────────
  function updateScore(): void {
    const correctEl = document.getElementById('game-score-correct');
    const totalEl = document.getElementById('game-score-total');
    const streakWrap = document.getElementById('game-streak');
    const streakNum = document.getElementById('game-streak-count');
    if (correctEl !== null) correctEl.textContent = String(score.correct);
    if (totalEl !== null) totalEl.textContent = String(score.total);
    if (streakWrap !== null && streakNum !== null) {
      const show = score.streak >= 3;
      streakWrap.hidden = !show;
      if (show) streakNum.textContent = String(score.streak);
    }
  }

  // ── Round management ─────────────────────────────────────────────────
  function newRound(): void {
    answered = false;
    lastCorrect = false;
    selectedId = null;
    [current] = pickRandom(cityEntries, 1);
    if (mode !== 'type-name') {
      options = shuffle([current, ...pickRandom(cityEntries, 3, current)]);
    }
    render();
  }

  function onAnswer(isCorrect: boolean, selected: string): void {
    if (answered) return;
    answered = true;
    lastCorrect = isCorrect;
    selectedId = selected;
    score.total++;
    if (isCorrect) {
      score.correct++;
      score.streak++;
    } else {
      score.streak = 0;
    }
    updateScore();
    render();
  }

  // ── Shared HTML fragments ────────────────────────────────────────────
  function feedbackHtml(): string {
    const cls = lastCorrect ? 'game-feedback--correct' : 'game-feedback--wrong';
    const icon = lastCorrect ? '✓' : '✗';
    const text = lastCorrect
      ? 'Правильно!'
      : `Правильна відповідь: <strong>${escHtml(cityLabel(current))}</strong>`;
    return `<div class="game-feedback ${cls}" role="alert">${icon} ${text}</div>`;
  }

  function nextBtnHtml(): string {
    return `<button class="btn btn-primary game-next-btn">Далі →</button>`;
  }

  // ── Mode: type-name ──────────────────────────────────────────────────
  function renderTypeName(): void {
    gameArea!.innerHTML = `
      <div class="game-card" data-mode="type-name">
        <p class="game-question">Якому місту належить цей герб?</p>
        <div class="game-coat-display">
          <div class="game-coat-svg">${current.svg}</div>
        </div>
        ${
          answered
            ? `${feedbackHtml()}${nextBtnHtml()}`
            : `<form class="game-type-form" id="game-type-form" novalidate>
                 <input
                   class="game-type-input"
                   id="game-type-input"
                   type="text"
                   placeholder="Назва міста…"
                   autocomplete="off"
                   spellcheck="false"
                 />
                 <div class="game-type-actions">
                   <button type="submit" class="btn btn-primary">Перевірити</button>
                   <button type="button" class="btn btn-secondary game-skip-btn">Пропустити</button>
                 </div>
               </form>`
        }
      </div>`;

    if (!answered) {
      document.getElementById('game-type-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('game-type-input') as HTMLInputElement | null;
        const val = normalize(input?.value ?? '');
        const correct = normalize(cityLabel(current));
        const isOk = val.length >= 2 && (val === correct || correct.startsWith(val) || val.startsWith(correct));
        onAnswer(isOk, 'typed');
      });
      document.querySelector<HTMLButtonElement>('.game-skip-btn')?.addEventListener('click', () => {
        onAnswer(false, 'skip');
      });
      setTimeout(() => document.getElementById('game-type-input')?.focus(), 50);
    } else {
      document.querySelector<HTMLButtonElement>('.game-next-btn')?.addEventListener('click', newRound);
    }
  }

  // ── Mode: pick-name ──────────────────────────────────────────────────
  function renderPickName(): void {
    gameArea!.innerHTML = `
      <div class="game-card" data-mode="pick-name">
        <p class="game-question">Яке місто має цей герб?</p>
        <div class="game-coat-display">
          <div class="game-coat-svg">${current.svg}</div>
        </div>
        <div class="game-name-options">
          ${options
            .map((opt) => {
              const isCorrect = opt.id === current.id;
              const isSelected = answered && opt.id === selectedId;
              let cls = 'game-option-btn';
              if (answered) {
                if (isCorrect) cls += ' game-option-btn--correct';
                else if (isSelected) cls += ' game-option-btn--wrong';
              }
              const dis = answered ? ' disabled' : '';
              return `<button class="${cls}" data-id="${escHtml(opt.id)}"${dis}>${escHtml(cityLabel(opt))}</button>`;
            })
            .join('')}
        </div>
        ${answered ? `${feedbackHtml()}${nextBtnHtml()}` : ''}
      </div>`;

    if (!answered) {
      gameArea!.querySelectorAll<HTMLButtonElement>('.game-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset['id'];
          if (id === undefined) return;
          const isOk = id === current.id;
          gameArea!.querySelectorAll<HTMLButtonElement>('.game-option-btn').forEach((b) => {
            b.disabled = true;
            if (b.dataset['id'] === current.id) b.classList.add('game-option-btn--correct');
            else if (b === btn && !isOk) b.classList.add('game-option-btn--wrong');
          });
          onAnswer(isOk, id);
        });
      });
    } else {
      gameArea!.querySelector<HTMLButtonElement>('.game-next-btn')?.addEventListener('click', newRound);
    }
  }

  // ── Mode: pick-coat ──────────────────────────────────────────────────
  function renderPickCoat(): void {
    gameArea!.innerHTML = `
      <div class="game-card" data-mode="pick-coat">
        <p class="game-question">Який герб належить місту <strong>${escHtml(cityLabel(current))}</strong>?</p>
        <div class="game-coat-options">
          ${options
            .map((opt) => {
              const isCorrect = opt.id === current.id;
              const isSelected = answered && opt.id === selectedId;
              let cls = 'game-coat-option-btn';
              if (answered) {
                if (isCorrect) cls += ' game-coat-option-btn--correct';
                else if (isSelected) cls += ' game-coat-option-btn--wrong';
              }
              const dis = answered ? ' disabled' : '';
              return `<button class="${cls}" data-id="${escHtml(opt.id)}"${dis}>
                <div class="game-coat-option-svg">${opt.svg}</div>
              </button>`;
            })
            .join('')}
        </div>
        ${answered ? `${feedbackHtml()}${nextBtnHtml()}` : ''}
      </div>`;

    if (!answered) {
      gameArea!.querySelectorAll<HTMLButtonElement>('.game-coat-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset['id'];
          if (id === undefined) return;
          const isOk = id === current.id;
          gameArea!.querySelectorAll<HTMLButtonElement>('.game-coat-option-btn').forEach((b) => {
            b.disabled = true;
            if (b.dataset['id'] === current.id) b.classList.add('game-coat-option-btn--correct');
            else if (b === btn && !isOk) b.classList.add('game-coat-option-btn--wrong');
          });
          onAnswer(isOk, id);
        });
      });
    } else {
      gameArea!.querySelector<HTMLButtonElement>('.game-next-btn')?.addEventListener('click', newRound);
    }
  }

  // ── Dispatch ─────────────────────────────────────────────────────────
  function render(): void {
    if (mode === 'type-name') renderTypeName();
    else if (mode === 'pick-name') renderPickName();
    else renderPickCoat();
  }

  // ── Mode-switching buttons ────────────────────────────────────────────
  document.querySelectorAll<HTMLButtonElement>('.game-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const newMode = btn.dataset['mode'] as GameMode | undefined;
      if (newMode === undefined) return;
      mode = newMode;
      document.querySelectorAll<HTMLButtonElement>('.game-mode-btn').forEach((b) => {
        b.classList.toggle('game-mode-btn--active', b === btn);
      });
      score = { correct: 0, total: 0, streak: 0 };
      updateScore();
      newRound();
    });
  });

  // ── Start ─────────────────────────────────────────────────────────────
  newRound();
}

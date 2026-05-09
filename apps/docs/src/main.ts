/**
 * Blazon Docs — Interactive Documentation Entry Point
 *
 * Demonstrates the @blazon/core API with a live registry demo.
 * No framework dependency — plain TypeScript with the Vite dev server.
 */

import {
  registerCountry,
  getCountryRegistry,
  searchRegistry,
  getById,
} from '@blazon/core';
import type { CoatOfArms, SearchQuery } from '@blazon/types';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github-dark.css';
import { initGame } from './game.js';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);

// ─── Load all generated city entries via Vite glob import ─────────────────

const cityModules = import.meta.glob<CoatOfArms>(
  '../../../assets/pl/city/*/index.json',
  { eager: true },
);

const cityEntries: CoatOfArms[] = Object.values(cityModules);

// Register Poland loader
registerCountry('PL', () =>
  Promise.resolve({
    countryCode: 'PL',
    name: 'Poland',
    entries: cityEntries,
  }),
);

// ─── DOM helpers ──────────────────────────────────────────────────────────

function el(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (element === null) throw new Error(`Element #${id} not found`);
  return element;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Demo registry viewer ─────────────────────────────────────────────────

const resultsGrid = el('results') as HTMLDivElement;
const detailPanel = el('detail-panel') as HTMLDivElement;
const coatDetail = el('coat-detail') as HTMLDivElement;
const resultsMeta = el('results-count') as HTMLParagraphElement;
const searchInput = el('search-input') as HTMLInputElement;
const countryFilter = el('country-filter') as HTMLSelectElement;
const levelFilter = el('level-filter') as HTMLSelectElement;
let selectedCoatId: string | null = null;

function renderResults(coats: readonly CoatOfArms[]): void {
  const visibleIds = new Set(coats.map((coat) => coat.id));
  if (selectedCoatId !== null && !visibleIds.has(selectedCoatId)) {
    selectedCoatId = null;
  }

  resultsGrid.innerHTML = coats
    .map(
      (c) => {
        const isActive = selectedCoatId === c.id;
        return `<button class="result-item${isActive ? ' result-item--active' : ''}" data-id="${escapeHtml(c.id)}" tabindex="0" aria-pressed="${isActive ? 'true' : 'false'}">
          <div class="result-item__svg">${c.svg}</div>
          <span class="result-item__name">${escapeHtml(c.name)}</span>
        </button>`;
      },
    )
    .join('');

  resultsMeta.textContent = coats.length === 0
    ? 'No results found.'
    : `Showing ${String(coats.length)} result${coats.length === 1 ? '' : 's'}`;
}

function renderDetail(coat: CoatOfArms): void {
  detailPanel.hidden = false;
  coatDetail.innerHTML = `
    <div class="coat-detail">
      <div class="coat-detail__svg-wrap">${coat.svg}</div>
      <div class="coat-detail__meta">
        <div class="meta-row meta-row--current"><span class="meta-label">Viewing</span><strong>${escapeHtml(coat.name)}</strong></div>
        <div class="meta-row"><span class="meta-label">Name</span><span>${escapeHtml(coat.name)}</span></div>
        <div class="meta-row"><span class="meta-label">ID</span><code>${escapeHtml(coat.id)}</code></div>
        <div class="meta-row"><span class="meta-label">Country</span><span>${escapeHtml(coat.metadata.countryCode)}</span></div>
        <div class="meta-row"><span class="meta-label">Level</span><span>${escapeHtml(coat.metadata.level)}</span></div>
        <div class="meta-row"><span class="meta-label">Type</span><span>${escapeHtml(coat.metadata.type)}</span></div>
        ${coat.metadata.blazon ? `<div class="meta-row"><span class="meta-label">Blazon</span><em>${escapeHtml(coat.metadata.blazon)}</em></div>` : ''}
        <div class="meta-row"><span class="meta-label">License</span><a href="${escapeHtml(coat.license.url)}" target="_blank" rel="noopener">${escapeHtml(coat.license.spdx)}</a></div>
        ${coat.tags ? `<div class="meta-row"><span class="meta-label">Tags</span><span class="meta-tags">${coat.tags.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join('')}</span></div>` : ''}
      </div>
    </div>`;
}

async function runSearch(): Promise<void> {
  let query: SearchQuery = {};

  const textVal = searchInput.value.trim();
  if (textVal.length > 0) query = { ...query, text: textVal };

  const countryVal = countryFilter.value;
  if (countryVal.length > 0) query = { ...query, countryCode: countryVal };

  const levelVal = levelFilter.value;
  if (levelVal.length > 0) {
    query = {
      ...query,
      level: levelVal as NonNullable<SearchQuery['level']>,
    };
  }

  // Ensure the selected country is loaded
  if (countryVal.length > 0) {
    await getCountryRegistry(countryVal);
  } else {
    // Load all registered countries for demo
    await getCountryRegistry('PL');
  }

  const results = searchRegistry(query);
  renderResults(results);
}

// ─── Event wiring ─────────────────────────────────────────────────────────

searchInput.addEventListener('input', () => void runSearch());
countryFilter.addEventListener('change', () => void runSearch());
levelFilter.addEventListener('change', () => void runSearch());

resultsGrid.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest<HTMLButtonElement>('.result-item');
  if (target === null) return;
  const id = target.dataset.id;
  if (id === undefined) return;
  selectedCoatId = id;

  resultsGrid.querySelectorAll<HTMLButtonElement>('.result-item').forEach((item) => {
    const isActive = item.dataset.id === id;
    item.classList.toggle('result-item--active', isActive);
    item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  const coat = getById(id);
  if (coat !== undefined) renderDetail(coat);
});

// ─── Tab switching ────────────────────────────────────────────────────────

const tabsContainer = document.getElementById('install-tabs');
tabsContainer?.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.tab');
  if (btn === null) return;

  const tabId = btn.dataset.tab;
  if (tabId === undefined) return;

  tabsContainer.querySelectorAll<HTMLButtonElement>('.tab').forEach((t) => {
    t.classList.remove('tab--active');
  });
  btn.classList.add('tab--active');

  document.querySelectorAll<HTMLElement>('.tab-content').forEach((panel) => {
    panel.hidden = true;
  });

  const target = document.getElementById(`tab-${tabId}`);
  if (target !== null) target.hidden = false;
});

// ─── Bootstrap ────────────────────────────────────────────────────────────

void (async (): Promise<void> => {
  await getCountryRegistry('PL');
  await runSearch();
  hljs.highlightAll();
  initGame(cityEntries);
})();

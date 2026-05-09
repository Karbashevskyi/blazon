/**
 * Blazon Docs — Interactive Documentation Entry Point
 *
 * Demonstrates the @blazon/core API with a live registry demo.
 * No framework dependency — plain TypeScript with the Vite dev server.
 */

import { getById, search, filterByKind } from '@blazon/core';
import type { BlazonLocality, BlazonLocalityKind } from '@blazon/types';
import { polandRegistry } from '@blazon/poland';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import 'highlight.js/styles/github-dark.css';
import { initGame } from './game.js';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);

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

function getSvg(locality: BlazonLocality): string {
  return locality.assets.find((a) => a.kind === 'arms')?.svg ?? '';
}

// ─── Demo registry viewer ─────────────────────────────────────────────────

const resultsGrid = el('results') as HTMLDivElement;
const detailPanel = el('detail-panel') as HTMLDivElement;
const detailPanelEmpty = el('detail-panel-empty') as HTMLDivElement;
const coatDetail = el('coat-detail') as HTMLDivElement;
const resultsMeta = el('results-count') as HTMLParagraphElement;
const searchInput = el('search-input') as HTMLInputElement;
const countryFilter = el('country-filter') as HTMLSelectElement;
const levelFilter = el('level-filter') as HTMLSelectElement;
let selectedCoatId: string | null = null;

function renderResults(localities: readonly BlazonLocality[]): void {
  const visibleIds = new Set(localities.map((c) => c.id));
  if (selectedCoatId !== null && !visibleIds.has(selectedCoatId)) {
    selectedCoatId = null;
  }

  resultsGrid.innerHTML = localities
    .map((c) => {
      const isActive = selectedCoatId === c.id;
      const svg = getSvg(c);
      return `<button class="result-item${isActive ? ' result-item--active' : ''}" data-id="${escapeHtml(c.id)}" tabindex="0" aria-pressed="${isActive ? 'true' : 'false'}">
          <div class="result-item__svg">${svg}</div>
          <span class="result-item__name">${escapeHtml(c.name)}</span>
        </button>`;
    })
    .join('');

  resultsMeta.textContent =
    localities.length === 0
      ? 'No results found.'
      : `Showing ${String(localities.length)} result${localities.length === 1 ? '' : 's'}`;

  if (selectedCoatId === null) {
    detailPanel.hidden = true;
    detailPanelEmpty.hidden = false;
  }
}

function renderDetail(locality: BlazonLocality): void {
  detailPanel.hidden = false;
  detailPanelEmpty.hidden = true;
  const svg = getSvg(locality);
  const license = locality.license;
  const source = locality.sources?.[0];
  coatDetail.innerHTML = `
    <div class="coat-detail">
      <div class="coat-detail__svg-wrap">${svg}</div>
      <div class="coat-detail__meta">
        <div class="meta-row meta-row--current"><span class="meta-label">Viewing</span><strong>${escapeHtml(locality.name)}</strong></div>
        <div class="meta-row"><span class="meta-label">Name</span><span>${escapeHtml(locality.name)}</span></div>
        <div class="meta-row"><span class="meta-label">ID</span><code>${escapeHtml(locality.id)}</code></div>
        <div class="meta-row"><span class="meta-label">Country</span><span>${escapeHtml(locality.countryCode)}</span></div>
        <div class="meta-row"><span class="meta-label">Kind</span><span>${escapeHtml(locality.kind)}</span></div>
        ${locality.region ? `<div class="meta-row"><span class="meta-label">Region</span><span>${escapeHtml(locality.region)}</span></div>` : ''}
        ${license ? `<div class="meta-row"><span class="meta-label">License</span><a href="${escapeHtml(license.url)}" target="_blank" rel="noopener">${escapeHtml(license.spdx)}</a></div>` : ''}
        ${source ? `<div class="meta-row"><span class="meta-label">Source</span><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">View source</a></div>` : ''}
        ${locality.aliases ? `<div class="meta-row"><span class="meta-label">Aliases</span><span class="meta-tags">${locality.aliases.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join('')}</span></div>` : ''}
      </div>
    </div>`;
}

function runSearch(): void {
  const textVal = searchInput.value.trim();
  const kindVal = levelFilter.value as BlazonLocalityKind | '';

  let results: readonly BlazonLocality[];

  if (kindVal) {
    results = filterByKind(polandRegistry, kindVal);
    if (textVal) {
      results = search(results, textVal);
    }
  } else if (textVal) {
    results = search(polandRegistry, textVal);
  } else {
    results = polandRegistry.entries;
  }

  renderResults(results);
}

// ─── Event wiring ─────────────────────────────────────────────────────────

searchInput.addEventListener('input', () => {
  runSearch();
});
countryFilter.addEventListener('change', () => {
  runSearch();
});
levelFilter.addEventListener('change', () => {
  runSearch();
});

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

  const locality = getById(polandRegistry, id);
  if (locality !== undefined) renderDetail(locality);
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

((): void => {
  runSearch();

  const firstLocality = polandRegistry.entries.at(0);
  if (firstLocality !== undefined) {
    selectedCoatId = firstLocality.id;
    renderResults(polandRegistry.entries);
    renderDetail(firstLocality);
  }

  hljs.highlightAll();
  initGame(polandRegistry.entries);
})();

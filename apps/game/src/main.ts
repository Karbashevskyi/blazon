import { polandRegistry } from '@blazon/poland';
import { filterByKind } from '@blazon/core';
import { detectLang, setLang, TRANSLATIONS, LANG_LABELS, LANGS, type Lang } from './i18n';
import { initGame } from './game';

// ─── Language setup ───────────────────────────────────────────────────────────

const lang: Lang = detectLang();
setLang(lang);
const t = TRANSLATIONS[lang];

// ─── Update page metadata ─────────────────────────────────────────────────────

document.title = t.pageTitle;

const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
if (metaDesc !== null) metaDesc.content = t.ogDescription;

const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
if (ogTitle !== null) ogTitle.content = t.pageTitle;

const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
if (ogDesc !== null) ogDesc.content = t.ogDescription;

// ─── Apply i18n to static HTML ────────────────────────────────────────────────

const titleEl = document.getElementById('page-title');
if (titleEl !== null) titleEl.textContent = t.pageTitle;

const subtitleEl = document.getElementById('page-subtitle');
if (subtitleEl !== null) subtitleEl.textContent = t.pageSubtitle;

const scoreLabelEl = document.getElementById('game-score-label');
if (scoreLabelEl !== null) scoreLabelEl.textContent = t.scoreLabel + ':';

const docsLinkEl = document.getElementById('docs-link');
if (docsLinkEl !== null) docsLinkEl.textContent = t.docsLink;

// Apply mode button labels
const modeBtns = document.querySelectorAll<HTMLButtonElement>('[data-mode-label]');
modeBtns.forEach((btn) => {
  const key = btn.dataset.modeLabel as 'pick-name' | 'pick-coat' | 'type-name' | undefined;
  if (key === 'pick-name') btn.textContent = t.modePickName;
  else if (key === 'pick-coat') btn.textContent = t.modePickCoat;
  else if (key === 'type-name') btn.textContent = t.modeTypeName;
});

// ─── Language switcher ────────────────────────────────────────────────────────

const langSwitcher = document.getElementById('lang-switcher');
if (langSwitcher !== null) {
  langSwitcher.innerHTML = LANGS.map((l) => {
    const active = l === lang ? ' lang-btn--active' : '';
    return `<button class="lang-btn${active}" data-lang="${l}" aria-label="${LANG_LABELS[l]}">${l.toUpperCase()}</button>`;
  }).join('');

  langSwitcher.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang as Lang | undefined;
      if (selectedLang !== undefined) {
        setLang(selectedLang);
        window.location.reload();
      }
    });
  });
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const cities = filterByKind(polandRegistry, 'city');

// ─── Boot quiz ────────────────────────────────────────────────────────────────

initGame(cities, t, lang);

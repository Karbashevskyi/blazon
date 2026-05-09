// ─── Supported languages ────────────────────────────────────────────────────

export type Lang = 'en' | 'pl' | 'uk' | 'de';

export const LANGS: readonly Lang[] = ['en', 'pl', 'uk', 'de'];

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  pl: 'Polski',
  uk: 'Українська',
  de: 'Deutsch',
};

// ─── Translation shape ───────────────────────────────────────────────────────

export interface Translations {
  pageTitle: string;
  pageSubtitle: string;
  ogDescription: string;
  modePickName: string;
  modePickCoat: string;
  modeTypeName: string;
  questionPickName: string;
  questionPickCoat: (city: string) => string;
  questionTypeName: string;
  scoreLabel: string;
  streakLabel: (n: number) => string;
  feedbackCorrect: string;
  feedbackWrong: (city: string) => string;
  next: string;
  skip: string;
  check: string;
  placeholder: string;
  docsLink: string;
}

// ─── Translations ────────────────────────────────────────────────────────────

const en: Translations = {
  pageTitle: 'Blazon Quiz — Polish Coats of Arms',
  pageSubtitle: 'How well do you know the heraldry of Polish cities?',
  ogDescription: 'Test your knowledge of Polish city coats of arms. 3 game modes, 490+ cities.',
  modePickName: 'Pick a name',
  modePickCoat: 'Pick a coat',
  modeTypeName: 'Type the name',
  questionPickName: 'Which city has this coat of arms?',
  questionPickCoat: (city) => `Which coat of arms belongs to ${city}?`,
  questionTypeName: 'Which city does this coat of arms belong to?',
  scoreLabel: 'Score',
  streakLabel: (n) => `🔥 ${String(n)} streak`,
  feedbackCorrect: '✓ Correct!',
  feedbackWrong: (city) => `✗ Correct answer: ${city}`,
  next: 'Next →',
  skip: 'Skip',
  check: 'Check',
  placeholder: 'City name…',
  docsLink: 'Documentation',
};

const pl: Translations = {
  pageTitle: 'Blazon Quiz — Herby polskich miast',
  pageSubtitle: 'Jak dobrze znasz heraldykę polskich miast?',
  ogDescription: 'Sprawdź swoją wiedzę o herbach polskich miast. 3 tryby gry, 490+ miast.',
  modePickName: 'Wybierz nazwę',
  modePickCoat: 'Wybierz herb',
  modeTypeName: 'Wpisz nazwę',
  questionPickName: 'Które miasto ma ten herb?',
  questionPickCoat: (city) => `Który herb należy do miasta ${city}?`,
  questionTypeName: 'Do którego miasta należy ten herb?',
  scoreLabel: 'Wynik',
  streakLabel: (n) => `🔥 Seria ${String(n)}`,
  feedbackCorrect: '✓ Poprawnie!',
  feedbackWrong: (city) => `✗ Poprawna odpowiedź: ${city}`,
  next: 'Dalej →',
  skip: 'Pomiń',
  check: 'Sprawdź',
  placeholder: 'Nazwa miasta…',
  docsLink: 'Dokumentacja',
};

const uk: Translations = {
  pageTitle: 'Blazon Quiz — Герби польських міст',
  pageSubtitle: 'Наскільки добре ти знаєш геральдику польських міст?',
  ogDescription: 'Перевір свої знання гербів польських міст. 3 режими гри, 490+ міст.',
  modePickName: 'Вибери назву',
  modePickCoat: 'Вибери герб',
  modeTypeName: 'Введи назву',
  questionPickName: 'Яке місто має цей герб?',
  questionPickCoat: (city) => `Який герб належить місту ${city}?`,
  questionTypeName: 'Якому місту належить цей герб?',
  scoreLabel: 'Рахунок',
  streakLabel: (n) => `🔥 Серія ${String(n)}`,
  feedbackCorrect: '✓ Правильно!',
  feedbackWrong: (city) => `✗ Правильна відповідь: ${city}`,
  next: 'Далі →',
  skip: 'Пропустити',
  check: 'Перевірити',
  placeholder: 'Назва міста…',
  docsLink: 'Документація',
};

const de: Translations = {
  pageTitle: 'Blazon Quiz — Wappen polnischer Städte',
  pageSubtitle: 'Wie gut kennst du die Heraldik polnischer Städte?',
  ogDescription: 'Teste dein Wissen über Wappen polnischer Städte. 3 Spielmodi, 490+ Städte.',
  modePickName: 'Stadt wählen',
  modePickCoat: 'Wappen wählen',
  modeTypeName: 'Name eingeben',
  questionPickName: 'Welche Stadt hat dieses Wappen?',
  questionPickCoat: (city) => `Welches Wappen gehört zu ${city}?`,
  questionTypeName: 'Zu welcher Stadt gehört dieses Wappen?',
  scoreLabel: 'Punktzahl',
  streakLabel: (n) => `🔥 Serie ${String(n)}`,
  feedbackCorrect: '✓ Richtig!',
  feedbackWrong: (city) => `✗ Richtige Antwort: ${city}`,
  next: 'Weiter →',
  skip: 'Überspringen',
  check: 'Prüfen',
  placeholder: 'Stadtname…',
  docsLink: 'Dokumentation',
};

export const TRANSLATIONS: Record<Lang, Translations> = { en, pl, uk, de };

// ─── Language detection ──────────────────────────────────────────────────────

export function detectLang(): Lang {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param !== null && (LANGS as readonly string[]).includes(param)) {
    return param as Lang;
  }
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if ((LANGS as readonly string[]).includes(browser)) return browser as Lang;
  return 'en';
}

export function setLang(lang: Lang): void {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', url.toString());
  document.documentElement.lang = lang;
}

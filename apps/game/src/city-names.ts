/**
 * Known city name translations for Polish cities.
 *
 * Most Polish city names are identical (or nearly identical) across languages.
 * This map covers only cities with well-established distinct names in EN / UK / DE.
 * If a language key is absent, the display falls back to the Polish name.
 */

export type CityLang = 'en' | 'pl' | 'uk' | 'de';

/**
 * Map of city ID → translations per language.
 * The `pl` key is the canonical Polish name (without "Herb " prefix).
 */
export const CITY_NAMES: Readonly<Record<string, Partial<Record<CityLang, string>>>> = {
  // ── Major cities ────────────────────────────────────────────────────────────
  'pl-city-warsaw': {
    en: 'Warsaw',
    uk: 'Варшава',
    de: 'Warschau',
  },
  'pl-city-krakow': {
    en: 'Kraków',
    uk: 'Краків',
    de: 'Krakau',
  },
  'pl-city-gdansk': {
    en: 'Gdańsk',
    uk: 'Гданськ',
    de: 'Gdańsk',
  },
  'pl-city-poznan': {
    en: 'Poznań',
    uk: 'Познань',
    de: 'Posen',
  },
  'pl-city-bydgoszcz': {
    uk: 'Бидгощ',
    de: 'Bromberg',
  },
  'pl-city-lublin': {
    uk: 'Люблін',
  },
  'pl-city-bialystok': {
    uk: 'Білосток',
  },
  'pl-city-gdynia': {
    uk: 'Гдиня',
    de: 'Gdingen',
  },
  'pl-city-czestochowa': {
    en: 'Częstochowa',
    uk: 'Ченстохова',
    de: 'Tschenstochau',
  },
  'pl-city-plock': {
    uk: 'Плоцьк',
  },
  'pl-city-elblag': {
    uk: 'Ельблонг',
    de: 'Elbing',
  },
  'pl-city-chorzow': {
    uk: 'Хожув',
    de: 'Königshütte',
  },
  'pl-city-rybnik': {
    uk: 'Рибнік',
  },
  'pl-city-tarnow': {
    uk: 'Тарнів',
  },
  'pl-city-bielsko-biala': {
    uk: 'Більсько-Бяла',
    de: 'Bielitz-Biala',
  },

  // ── Cities with historical German names ────────────────────────────────────
  'pl-city-boleslawiec': {
    uk: 'Болеславець',
    de: 'Bunzlau',
  },
  'pl-city-brzeg-dolny': {
    de: 'Dyhernfurth',
  },
  'pl-city-chelmno': {
    en: 'Chełmno',
    uk: 'Хелмно',
    de: 'Kulm',
  },
  'pl-city-chelmza': {
    uk: 'Хелмжа',
    de: 'Culmsee',
  },
  'pl-city-gliwice-old': {
    uk: 'Глівіце',
    de: 'Gleiwitz',
  },
  'pl-city-gniezno': {
    en: 'Gniezno',
    uk: 'Гнєзно',
    de: 'Gnesen',
  },
  'pl-city-jelenia-gora': {
    uk: 'Єленя-Гура',
    de: 'Hirschberg',
  },
  'pl-city-kamienna-gora': {
    uk: 'Камєнна-Гура',
    de: 'Landeshut',
  },
  'pl-city-ketrzyn': {
    uk: 'Кентшин',
    de: 'Rastenburg',
  },
  'pl-city-klodzko': {
    uk: 'Клодзько',
    de: 'Glatz',
  },
  'pl-city-lebork': {
    uk: 'Лемборк',
    de: 'Lauenburg',
  },
  'pl-city-legnica': {
    uk: 'Легніца',
    de: 'Liegnitz',
  },
  'pl-city-leszno': {
    uk: 'Лешно',
    de: 'Lissa',
  },
  'pl-city-malbork': {
    en: 'Malbork',
    uk: 'Мальборк',
    de: 'Marienburg',
  },
  'pl-city-nowa-sol': {
    uk: 'Нова-Суль',
    de: 'Neusalz',
  },
  'pl-city-nowy-sacz': {
    uk: 'Новий-Сонч',
    de: 'Neu Sandez',
  },
  'pl-city-olawa': {
    uk: 'Олава',
    de: 'Ohlau',
  },
  'pl-city-swidnica': {
    uk: 'Свидниця',
    de: 'Schweidnitz',
  },
  'pl-city-swinoujscie': {
    uk: 'Свіноуйсьце',
    de: 'Swinemünde',
  },
  'pl-city-torun': {
    en: 'Toruń',
    uk: 'Торунь',
    de: 'Thorn',
  },
  'pl-city-walcz': {
    uk: 'Валч',
    de: 'Deutsch Krone',
  },
  'pl-city-zagan': {
    uk: 'Жагань',
    de: 'Sagan',
  },
  'pl-city-zary': {
    uk: 'Жари',
    de: 'Sorau',
  },
  'pl-city-zgorzelec': {
    en: 'Zgorzelec',
    uk: 'Згожелець',
    de: 'Görlitz',
  },
  'pl-city-zlotow': {
    uk: 'Злотув',
    de: 'Flatow',
  },
  'pl-city-zyrardow': {
    uk: 'Жирардув',
  },

  // ── Cities with Ukrainian-specific names ────────────────────────────────────
  'pl-city-augustow': { uk: 'Августів' },
  'pl-city-bedzin': { uk: 'Бендзін' },
  'pl-city-belchatow': { uk: 'Белхатув' },
  'pl-city-biala-podlaska': { uk: 'Бяла-Підляська' },
  'pl-city-bielawa': { uk: 'Бєлава' },
  'pl-city-bielsk-podlaski': { uk: 'Більськ-Підляський' },
  'pl-city-bilgoraj': { uk: 'Більгорай' },
  'pl-city-braniewo': { uk: 'Бранєво', de: 'Braunsberg' },
  'pl-city-brzeszcze': { uk: 'Бжещче' },
  'pl-city-busko-zdroj': { uk: 'Буско-Здруй' },
  'pl-city-bystrzyca-klodzka-alt': { uk: 'Биструця-Клодзька', de: 'Habelschwerdt' },
  'pl-city-bytow': { uk: 'Битув', de: 'Bütow' },
  'pl-city-checiny': { uk: 'Хенцини' },
  'pl-city-chojna': { uk: 'Хойна', de: 'Königsberg' },
  'pl-city-chojnice': { uk: 'Хойніце', de: 'Konitz' },
  'pl-city-chojnow': { uk: 'Хойнув', de: 'Haynau' },
  'pl-city-jarocin': { uk: 'Ярочин' },
  'pl-city-jaslo': { uk: 'Ясло' },
  'pl-city-jastrowie': { uk: 'Ястровє', de: 'Jastrow' },
  'pl-city-jaworzyna-slaska-alt': { uk: 'Явожина-Шльонська', de: 'Königszelt' },
  'pl-city-jedrzejow': { uk: 'Єнджеюв' },
  'pl-city-kalisz': { uk: 'Каліш', de: 'Kalisch' },
  'pl-city-kepno': { uk: 'Кемпно', de: 'Kempen' },
  'pl-city-kielce': { uk: 'Кельце' },
  'pl-city-kolobrzeg': { uk: 'Колобжег', de: 'Kolberg' },
  'pl-city-konin': { uk: 'Конін' },
  'pl-city-koscian': { uk: 'Косьцян', de: 'Kosten' },
  'pl-city-kostrzyn-nad-odra': { uk: 'Кострин-над-Одрою', de: 'Küstrin' },
  'pl-city-kozienice': { uk: 'Козеніце' },
  'pl-city-krosno': { uk: 'Кросно' },
  'pl-city-lowicz': { uk: 'Ловіч' },
  'pl-city-lukow': { uk: 'Луків' },
  'pl-city-myszkow': { uk: 'Мишків' },
  'pl-city-nowy-targ': { uk: 'Новий-Тарг' },
  'pl-city-olkusz': { uk: 'Олькуш', de: 'Ilkenau' },
  'pl-city-ostrow-wielkopolski': { uk: 'Острів-Велькопольський' },
  'pl-city-ostrowiec-swietokrzyski': { uk: 'Островець-Свєнтокшиський' },
  'pl-city-otwock': { uk: 'Отвоцьк' },
  'pl-city-pruszków': { uk: 'Прушків' },
  'pl-city-pruszkow': { uk: 'Прушків' },
  'pl-city-pultusk': { uk: 'Пултуськ' },
  'pl-city-radom': { uk: 'Радом' },
  'pl-city-rawicz': { uk: 'Равіч', de: 'Rawitsch' },
  'pl-city-rzeszow': { uk: 'Ряшів' },
  'pl-city-sanok': { uk: 'Сянік' },
  'pl-city-siedlce': { uk: 'Седльце' },
  'pl-city-sierpc': { uk: 'Серпць' },
  'pl-city-skarzysko-kamienna': { uk: 'Скаржиськ-Кам\u2019янна' },
  'pl-city-skierniewice': { uk: 'Скернєвіце' },
  'pl-city-sosnowiec': { uk: 'Сосновець', de: 'Sosnowitz' },
  'pl-city-srem': { uk: 'Шрем', de: 'Schrimm' },
  'pl-city-sroda-slaska': { uk: 'Шрода-Шльонська', de: 'Neumarkt' },
  'pl-city-sroda-wielkopolska': { uk: 'Шрода-Велькопольська', de: 'Schroda' },
  'pl-city-starachowice': { uk: 'Стараховіце' },
  'pl-city-stargard': { uk: 'Старґард', de: 'Stargard' },
  'pl-city-sulechow': { uk: 'Сулехув', de: 'Züllichau' },
  'pl-city-sulecin': { uk: 'Сулецін', de: 'Zielenzig' },
  'pl-city-swiebodzin': { uk: 'Свєбодзін', de: 'Schwiebus' },
  'pl-city-szczecinek': { uk: 'Щецінек', de: 'Neustettin' },
  'pl-city-szegow': { uk: 'Шегів' },
  'pl-city-szydlowiec': { uk: 'Шидловець' },
  'pl-city-tczew': { uk: 'Тчев', de: 'Dirschau' },
  'pl-city-tomaszow-mazowiecki': { uk: 'Томашув-Мазовецький' },
  'pl-city-wabrzezno': { uk: 'Вомбжезно', de: 'Briesen' },
  'pl-city-wagrowiec': { uk: 'Вонгровець', de: 'Wongrowitz' },
  'pl-city-wielun': { uk: 'Велюнь' },
  'pl-city-wodzislaw-slaski': { uk: 'Водзіслав-Шльонський', de: 'Loslau' },
  'pl-city-zarow': { uk: 'Жарув', de: 'Saarau' },
  'pl-city-zawiercie': { uk: 'Завєрцє' },
  'pl-city-zielona-gora': { uk: 'Зелена-Гура', de: 'Grünberg' },
  'pl-city-zloczew': { uk: 'Злочев' },
  'pl-city-znin': { uk: 'Жнін', de: 'Znin' },
  'pl-city-zukowo': { uk: 'Жуково' },
};

/**
 * Get the display name for a city in the requested language.
 * Falls back to the provided Polish fallback name if no translation exists.
 */
export function getCityName(cityId: string, lang: CityLang, polishFallback: string): string {
  const translations: Partial<Record<CityLang, string>> | undefined = (
    CITY_NAMES as Record<string, Partial<Record<CityLang, string>> | undefined>
  )[cityId];
  if (translations === undefined) return polishFallback;
  return translations[lang] ?? polishFallback;
}

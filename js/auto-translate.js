// js/auto-translate.js  (admin pages only)
//
// Automatic translation of quiz and major text into the languages students can
// pick. It runs in the ADMIN'S BROWSER when a question or major is saved, using
// the free MyMemory service (no account or key needed), then stores the results
// in the database through api/translations.php. Students never call MyMemory.
//
//  - Only text with no stored translation yet is sent, so nothing is overwritten.
//  - If the service is unavailable or over its free daily limit, the text simply
//    stays in English for students; press "Translate missing text" later to retry.
//  - Machine translation can be imperfect. To correct a translation, edit its
//    row in the `translations` table (phpMyAdmin).
//
// Optional: put a real email address below to raise MyMemory's free daily
// allowance (about 5,000 -> 50,000 characters). Leave blank to stay anonymous.
const MYMEMORY_EMAIL = '';

// language code used on this site -> MyMemory language code
const AUTO_TRANSLATE_LANGS = { zh: 'zh-CN', es: 'es', fr: 'fr' };

const TRANSLATE_API = './api/translations.php';
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const MYMEMORY_MAX_BYTES = 400;     // service limit is 500 bytes per request
const TRANSLATE_DELAY_MS = 250;     // be polite to the free service

function setTranslateStatus(message) {
  const el = document.getElementById('translateStatus');
  if (el) el.textContent = message;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const byteLength = (text) => new TextEncoder().encode(text).length;

/** Split long text on sentence boundaries so each piece fits the service limit. */
function splitForTranslation(text) {
  if (byteLength(text) <= MYMEMORY_MAX_BYTES) return [text];

  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  const chunks = [];
  let current = '';
  sentences.forEach((sentence) => {
    if (current && byteLength(current + sentence) > MYMEMORY_MAX_BYTES) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence;
  });
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Translate one short piece of text. Returns the translation, or null on any failure. */
async function translateChunk(chunk, targetCode) {
  const params = new URLSearchParams({ q: chunk, langpair: `en|${targetCode}` });
  if (MYMEMORY_EMAIL) params.set('de', MYMEMORY_EMAIL);

  try {
    const res = await fetch(`${MYMEMORY_URL}?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const translated = data && data.responseData && data.responseData.translatedText;
    // MyMemory reports quota problems inside a normal-looking response
    if (Number(data.responseStatus) !== 200 || !translated || /^MYMEMORY WARNING/i.test(translated)) {
      return null;
    }
    return translated;
  } catch (err) {
    return null;
  }
}

/** Translate text of any length. Returns null if any piece fails (we never save half a translation). */
async function translateText(text, targetCode) {
  const parts = [];
  for (const chunk of splitForTranslation(text)) {
    const translated = await translateChunk(chunk, targetCode);
    if (translated === null) return null;
    parts.push(translated);
    await sleep(TRANSLATE_DELAY_MS);
  }
  return parts.join(' ');
}

async function fetchStoredTranslations(lang) {
  const res = await fetch(`${TRANSLATE_API}?lang=${encodeURIComponent(lang)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not read translations (${res.status})`);
  return res.json();
}

async function storeTranslations(items) {
  const res = await apiFetch(TRANSLATE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  if (!res.ok) throw new Error(`Could not save translations (${res.status})`);
  return res.json();
}

/**
 * Translate every text in `texts` that has no stored translation yet, for each
 * language, and save the results. Updates #translateStatus as it goes.
 */
async function autoTranslateTexts(texts) {
  const unique = [...new Set(texts.map((t) => String(t || '').trim()).filter(Boolean))];
  if (unique.length === 0) return;

  setTranslateStatus('Checking translations…');
  const jobs = [];
  try {
    for (const lang of Object.keys(AUTO_TRANSLATE_LANGS)) {
      const stored = await fetchStoredTranslations(lang);
      unique.forEach((source) => {
        if (!stored[source]) jobs.push({ lang, source });
      });
    }
  } catch (err) {
    setTranslateStatus(`Translation skipped: ${err.message}`);
    return;
  }

  if (jobs.length === 0) {
    setTranslateStatus('All text is already translated.');
    return;
  }

  const results = [];
  let failed = 0;
  for (let i = 0; i < jobs.length; i++) {
    const { lang, source } = jobs[i];
    setTranslateStatus(`Translating… ${i + 1} of ${jobs.length}`);
    const translated = await translateText(source, AUTO_TRANSLATE_LANGS[lang]);
    if (translated === null) {
      failed++;
      // The service is refusing us (usually the free daily limit): stop early.
      if (failed >= 3 && results.length === 0) break;
    } else {
      results.push({ lang, source, translated });
    }
  }

  try {
    if (results.length) await storeTranslations(results);
  } catch (err) {
    setTranslateStatus(`Translations could not be saved: ${err.message}`);
    return;
  }

  const notDone = jobs.length - results.length;
  setTranslateStatus(
    notDone === 0
      ? `Translated and saved ${results.length} item(s).`
      : `Saved ${results.length} translation(s); ${notDone} not translated (service unavailable or daily limit reached). Students see those in English. Use "Translate missing text" to retry later.`
  );
}

// ── gather the English text that needs translating ────────────────────────────

function collectQuestionTexts(question) {
  const texts = [question.text];
  (question.options || []).forEach((option) => {
    texts.push(option.text, option.subtext, option.feedback);
  });
  return texts;
}

function collectMajorTexts(major) {
  const courseNames = (major.relatedCourses || []).map((course) => course.name);
  return [major.title, major.personalityTag, major.careers, major.resultReason, major.exploreText, ...courseNames];
}

/** Retry button: translate everything currently in the quiz that has no translation. */
async function translateAllMissing() {
  setTranslateStatus('Loading quiz content…');
  try {
    const allQuestions = await loadQuestionsFromServer('all');
    await loadMajorInfoFromServer();
    const texts = [];
    allQuestions.forEach((q) => texts.push(...collectQuestionTexts(q)));
    majorKeys.forEach((code) => texts.push(...collectMajorTexts(majorInfo[code])));
    await autoTranslateTexts(texts);
  } catch (err) {
    setTranslateStatus(`Translation skipped: ${err.message}`);
  }
}

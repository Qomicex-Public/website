import { defineMiddleware } from 'astro/middleware';

function parseAcceptLanguage(header: string): Map<string, number> {
  const result = new Map<string, number>();
  for (const part of header.split(',')) {
    const [locale, qPart] = part.trim().split(';');
    const q = qPart ? parseFloat(qPart.replace('q=', '')) : 1;
    const lang = locale?.trim().split('-')[0];
    if (lang) {
      const current = result.get(lang) ?? 0;
      if (q > current) result.set(lang, q);
    }
  }
  return result;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname !== '/') return next();

  const accept = context.request.headers.get('accept-language') || '';
  const prefs = parseAcceptLanguage(accept);
  const enPref = prefs.get('en') ?? 0;
  const zhPref = Math.max(prefs.get('zh') ?? 0, prefs.get('zh-CN') ?? 0);

  if (enPref > zhPref) {
    return context.redirect('/en/', 302);
  }

  return next();
});

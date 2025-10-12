export type NormalizedToolCall = { name: string; args: Record<string, any> };

function tryJsonParse<T = any>(s?: string | null): T | undefined {
  if (!s) return undefined;
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

export function normalizeToolCalls(raw: any): NormalizedToolCall[] {
  if (!raw) return [];
  // Support both OpenAI-like tool_calls and custom_data.tool_calls
  // Shapes:
  // - { name: 'read_section', args: {...} }
  // - { function: { name: 'read_section', arguments: '{...}' } }
  const arr = Array.isArray(raw) ? raw : [];
  const calls: NormalizedToolCall[] = [];
  for (const t of arr) {
    if (!t) continue;
    if (t.name && t.args) {
      calls.push({ name: t.name, args: t.args });
    } else if (t.function?.name) {
      const parsed = tryJsonParse<Record<string, any>>(t.function.arguments);
      calls.push({ name: t.function.name, args: parsed ?? {} });
    }
  }
  return calls;
}

function romanToInt(roman: string): number | string {
  if (!roman) return '';
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (let i = roman.length - 1; i >= 0; i--) {
    const val = map[roman[i].toUpperCase()] ?? 0;
    if (val < prev) total -= val; else total += val;
    prev = val;
  }
  // Sanity: if conversion seems wrong, just return original roman
  return total > 0 ? total : roman;
}

function parseReadSectionArgs(args: Record<string, any>): string | null {
  const identifier = args?.identifier as string | undefined;
  if (!identifier) return null;
  const parts = identifier.split('/');
  let chapter: string | number | undefined;
  let article: string | undefined;
  for (const p of parts) {
    if (p.toLowerCase().startsWith('chapter_')) {
      const roman = p.split('_')[1] || '';
      chapter = romanToInt(roman);
    }
    if (p.toLowerCase().startsWith('article')) {
      const m = p.match(/(?:artikel_)?(\d+)/i);
      if (m) article = m[1];
    }
  }
  if (chapter || article) {
    const segs = [] as string[];
    if (chapter) segs.push(`Kapitel ${chapter}`);
    if (article) segs.push(`Artikel ${article}`);
    return `Lese ${segs.join(' ')}`;
  }
  return `Lese Abschnitt`;
}

export function formatToolActivity(call: NormalizedToolCall): string | null {
  switch (call.name) {
    case 'read_section':
      return parseReadSectionArgs(call.args);
    case 'get_content_tree': {
      const docId = call.args?.document_id;
      if (!docId) return 'Analysiere Dokument';
      return `Analysiere Dokument ${docId}`;
    }
    case 'update_object': {
      const ot = call.args?.object_type;
      return `Editiere ${ot ?? ''}`.trim();
    }
    default:
      return null;
  }
}

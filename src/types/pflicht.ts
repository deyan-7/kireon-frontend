import { Country } from './counties';

export type LaenderKuerzel = Country;

export interface Dokument {
  id: string;
  dokument_status: string | null;
  verfahren_status: string | null;
  bereich: string | null;
  gesetzeskuerzel: string | null;
  gesetzgebung: string | null;
  produktbereich: string | null;
  thema: string | null;
  zusammenfassung: string | null;
  titel: string | null;
  url: string | null;
  trace_id: string | null;
  extra_info: Record<string, any> | null;
  extraction_timestamp: string;
  pflichten: Pflicht[];
}

export interface DokumentDebugInfo {
  bereich: string | null;
  gesetzeskuerzel: string | null;
  gesetzgebung: string | null;
  dokument_status: string | null;
  verfahren_status: string | null;
}

export interface Pflicht {
  dokument_id: string;
  stichtag: string | null;
  stichtag_typ: string | null;
  folgestatus: string | null;
  thema: string | null;
  information: string | null;
  produkte: string[] | null;
  betroffene: string | null;
  ausblick: string | null;
  laenderkuerzel: Country[] | null;
  verweise: string | null;
  rechtsgrundlage_ref: string | null;
  belege: Beleg[] | null;
  extra_info: Record<string, any> | null;
}

export interface PflichtDebugInfo {
  stichtag_entscheidung: string | null;
  stichtag_kandidaten: string[] | null;
  stichtag_typen: string[] | null;
  normanker_belege: Beleg[] | null;
  folgestatus_belege: Beleg[] | null;
  laenderkuerzel_begruendung: string | null;
  produkte_belege: Beleg[] | null;
  betroffene_belege: Beleg[] | null;
  ausblick_belege: Beleg[] | null;
}

export interface Beleg {
  text: string;
  quelle: string;
  relevanz: number;
  anker?: string;
  textauszug?: string;
}

export interface DokumentFeedback {
  feedback_type: "positive" | "negative";
  message?: string | null;
}

/**
 * Frontend model for full Pflicht entries
 * Matches the backend Pydantic model 1:1
 */

export interface Pflicht {
  dokument_id: string | null;
  dokument_status: string | null;
  verfahren_status: string | null;
  bereich: string | null;
  gesetzeskuerzel: string | null;
  gesetzgebung: string | null;
  titel: string | null;
  stichtag: string | null;
  folgestatus: string | null;
  thema: string | null;
  information: string | null;
  produkte: string[] | null;
  produktbereich: string | null;
  betroffene: string | null;
  ausblick: string | null;
  dokument_information_url: string | null;
  extraction_timestamp: string;
  laenderkuerzel: string[] | null;
  debug: PflichtDebugInfo | null;
}

export interface PflichtDebugInfo {
  extraction_method: string | null;
  confidence_score: number | null;
  raw_data: Record<string, any> | null;
  processing_notes: string[] | null;
}

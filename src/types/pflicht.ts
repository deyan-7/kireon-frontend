/**
 * Frontend model for full Pflicht entries
 * Matches the backend Pydantic model 1:1
 */

export interface Pflicht {
  dokument_id: string | null;
  dokument_status: DokumentStatus | null;
  verfahren_status: VerfahrensStatus | null;
  bereich: GesetzBereich | null;
  gesetzeskuerzel: GesetzKuerzel | null;
  gesetzgebung: string | null;
  titel: string | null;
  stichtag: string | null; // ISO date string
  folgestatus: string | null;
  thema: string | null;
  information: string | null;
  information_erweitert: string | null;
  produkte: string[] | null;
  produktbereich: string | null;
  betroffene: string | null;
  ausblick: string | null;
  dokument_information_url: string | null;
  extraction_timestamp: string; // ISO datetime string
  jurisdiktion: Jurisdiktion;
  debug: PflichtDebugInfo | null;
}

export type DokumentStatus = 
  | "DRAFT"
  | "PUBLISHED"
  | "AMENDED"
  | "REPEALED"
  | "UNKNOWN";

export type VerfahrensStatus = 
  | "INITIATED"
  | "CONSULTATION"
  | "ADOPTED"
  | "IMPLEMENTED"
  | "SUSPENDED"
  | "UNKNOWN";

export type GesetzBereich = 
  | "Ökodesign"
  | "Energieverbrauchskennzeichnung"
  | "Chemikalienrecht"
  | "Produktsicherheit"
  | "Umweltrecht"
  | "Verbraucherschutz"
  | "Arbeitsschutz"
  | "Datenschutz"
  | "Sonstiges";

export type GesetzKuerzel = 
  | "Ökodesign"
  | "EnVKV"
  | "REACH"
  | "GPSG"
  | "BImSchG"
  | "VSchG"
  | "ArbSchG"
  | "DSGVO"
  | "Sonstiges";

export interface Jurisdiktion {
  markt: string;
  laender: string[];
}

export type JurisdiktionSimple = 
  | "EU"
  | "DE"
  | "AT"
  | "CH"
  | "OTHER";

export interface PflichtDebugInfo {
  extraction_method: string | null;
  confidence_score: number | null;
  raw_data: Record<string, any> | null;
  processing_notes: string[] | null;
}

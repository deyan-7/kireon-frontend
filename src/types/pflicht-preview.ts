/**
 * Frontend model for PflichtPreview entries
 * Matches the backend Pydantic model 1:1
 */

export interface PflichtPreview {
  id: number;
  dokument_id: string | null;
  bereich: GesetzBereich | null;
  gesetzeskuerzel: GesetzKuerzel | null;
  gesetzgebung: string | null;
  thema: string | null;
}

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

export interface PflichtPreviewSearchParams {
  skip?: number;
  limit?: number;
  bereich?: string | null;
  gesetzeskuerzel?: string | null;
  gesetzgebung?: string | null;
  thema_search?: string | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PflichtPreviewResponse {
  data: PflichtPreview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

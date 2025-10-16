import { Country } from './counties';

export type LaenderKuerzel = Country;

export interface Comment {
  id: number;
  text: string;
  created_at: string;
  created_by: string;
}

export type CreationStatus = 'creating' | 'ready' | 'error' | 'ingesting_sections' | 'extracting_content' | 'queued' | 'processing';

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
  notizen: string | null;
  titel: string | null;
  url: string | null;
  trace_id: string | null;
  extra_info: Record<string, any> | null;
  extraction_timestamp: string;
  pflichten: Pflicht[];
  comments: Comment[] | null;
  creation_status: CreationStatus;
  creation_error: string | null;
  retry_count: number;
  updated_at: string | null;
  locked_by: string | null;
  locked_at: string | null;
}

export interface DokumentDebugInfo {
  bereich: string | null;
  gesetzeskuerzel: string | null;
  gesetzgebung: string | null;
  dokument_status: string | null;
  verfahren_status: string | null;
}

export interface Pflicht {
  id: number;
  dokument_id: string;
  stichtag: string | null;
  stichtag_typ: string | null;
  folgestatus: string | null;
  thema: string | null;
  information: string | null;
  produkte: string[] | null;
  betroffene: string | null;
  ausblick: string | null;
  notizen: string | null;
  laenderkuerzel: Country[] | null;
  verweise: string | null;
  rechtsgrundlage_ref: string | null;
  belege: Beleg[] | null;
  extra_info: Record<string, any> | null;
  // New fields per updated model
  details_per_betroffene: ActorDetails[] | null;
  national_overrides: NationalOverride[] | null;
  comments: Comment[] | null;
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

export interface ChangeHistory {
  id: number;
  target_object_type: string;
  target_object_id: string | number;
  changes: any[];
  applied_at: string;
  applied_by: string;
  reverted: boolean;
  reverted_at: string | null;
  reverted_by: string | null;
}

export interface ActorDetails {
  betroffener: string;
  handlungsanweisungen: string | null;
}

export interface NationalOverride {
  laenderkuerzel: string;
  handlungsanweisungen: string | null;
}

export interface DokumentJobStatus {
  dokument_id: string;
  creation_status: CreationStatus;
  creation_error: string | null;
  retry_count: number;
}

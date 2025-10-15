export interface PflichtPreview {
  id: number;
  dokument_id: string | null;
  thema: string | null;
  stichtag: string | null;
  folgestatus: string | null;
  produkte: string[] | null;
  laenderkuerzel: string[] | null;
}

export interface DokumentPreview {
  id: string;
  bereich: string | null;
  gesetzeskuerzel: string | null;
  gesetzgebung: string | null;
  dokument_status: string | null;
  verfahren_status: string | null;
  extraction_timestamp: string;
  thema: string | null;
  url: string | null;
  pflichten: PflichtPreview[];
  creation_status: 'creating' | 'ready' | 'error' | null;
  creation_error: string | null;
  updated_at?: string | null;
  retry_count?: number;
}

export interface DokumentPreviewSearchParams {
  pagination_offset?: number;
  pagination_size?: number;
  bereich?: string | null;
  gesetzeskuerzel?: string | null;
  gesetzgebung?: string | null;
  thema_search?: string | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface DokumentPreviewResponse {
  data: DokumentPreview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchResultResponse {
  results: DokumentPreview[];
  total_count: number;
}

import { DokumentPreviewSearchParams, DokumentPreviewResponse, SearchResultResponse } from '@/types/pflicht-preview';
import { Pflicht, Dokument } from '@/types/pflicht';
import { auth } from '@/lib/auth';

export async function deleteDokument(dokumentId: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const response = await fetch(`${baseUrl}/dokument/${dokumentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
}

export async function getDokumentPreviews(params: DokumentPreviewSearchParams = {}): Promise<DokumentPreviewResponse> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const searchParams = new URLSearchParams();

  if (params.pagination_offset !== undefined) searchParams.append('pagination_offset', params.pagination_offset.toString());
  if (params.pagination_size !== undefined) searchParams.append('pagination_size', params.pagination_size.toString());
  if (params.bereich) searchParams.append('bereich', params.bereich);
  if (params.gesetzeskuerzel) searchParams.append('gesetzeskuerzel', params.gesetzeskuerzel);
  if (params.gesetzgebung) searchParams.append('gesetzgebung', params.gesetzgebung);
  if (params.thema_search) searchParams.append('thema_search', params.thema_search);
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.sort_order) searchParams.append('sort_order', params.sort_order);

  const requestUrl = `${baseUrl}/dokument/search?${searchParams.toString()}`;

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  if (result.results && typeof result.total_count === 'number') {
    const backendResponse: SearchResultResponse = result;
    const pagination_size = params.pagination_size || 50;
    const pagination_offset = params.pagination_offset || 0;
    const page = Math.floor(pagination_offset / pagination_size) + 1;
    const totalPages = Math.ceil(backendResponse.total_count / pagination_size);

    return {
      data: backendResponse.results,
      total: backendResponse.total_count,
      page,
      limit: pagination_size,
      totalPages
    };
  } else {
    const pagination_size = params.pagination_size || 50;
    const pagination_offset = params.pagination_offset || 0;
    const page = Math.floor(pagination_offset / pagination_size) + 1;

    return {
      data: [],
      total: 0,
      page,
      limit: pagination_size,
      totalPages: 1
    };
  }
}

export async function getPflichtDetails(pflichtId: number): Promise<Pflicht> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const requestUrl = `${baseUrl}/pflicht/${pflichtId}`;

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}
export async function updatePflicht(pflichtId: number, pflicht: Pflicht): Promise<Pflicht> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const requestUrl = `${baseUrl}/pflicht/${pflichtId}`;

  const response = await fetch(requestUrl, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(pflicht),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function createDokumentFromUrl(url: string): Promise<Dokument[]> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const requestUrl = `${baseUrl}/dokument/create?url=${encodeURIComponent(url)}`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    cache: 'no-cache',
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 409) {
      throw new Error(`Dokumente für diese URL existieren bereits`);
    } else if (response.status === 400) {
      throw new Error(`Ungültige URL: ${errorText}`);
    } else if (response.status === 422) {
      throw new Error(`URL ist erforderlich: ${errorText}`);
    }

    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result;
}

export async function deletePflicht(pflichtId: number): Promise<{ message: string }> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const requestUrl = `${baseUrl}/pflicht/${pflichtId}`;

  const response = await fetch(requestUrl, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 404) {
      throw new Error('Pflicht nicht gefunden');
    } else if (response.status === 400) {
      throw new Error(`Ungültige Anfrage: ${errorText}`);
    }

    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

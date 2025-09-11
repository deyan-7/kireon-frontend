import { PflichtPreviewSearchParams, PflichtPreviewResponse, SearchResultResponse } from '@/types/pflicht-preview';
import { Pflicht } from '@/types/pflicht';
import { auth } from '@/lib/auth';

/**
 * Service for managing PflichtPreview entries and full Pflicht details
 */

/**
 * Fetches PflichtPreview entries with search and pagination
 * @param params - Search and pagination parameters
 * @returns Promise<PflichtPreviewResponse>
 */
export async function getPflichtPreviews(params: PflichtPreviewSearchParams = {}): Promise<PflichtPreviewResponse> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kireon-backend-510702145393.europe-west4.run.app";

  // Build query parameters
  const searchParams = new URLSearchParams();

  if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
  if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  if (params.bereich) searchParams.append('bereich', params.bereich);
  if (params.gesetzeskuerzel) searchParams.append('gesetzeskuerzel', params.gesetzeskuerzel);
  if (params.gesetzgebung) searchParams.append('gesetzgebung', params.gesetzgebung);
  if (params.thema_search) searchParams.append('thema_search', params.thema_search);
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.sort_order) searchParams.append('sort_order', params.sort_order);

  const requestUrl = `${baseUrl}/pflicht/preview-search?${searchParams.toString()}`;

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

  // Handle new backend response format
  if (result.results && typeof result.total_count === 'number') {
    // New backend format: { results: PflichtPreview[], total_count: number }
    const backendResponse: SearchResultResponse = result;
    const limit = params.limit || 10;
    const skip = params.skip || 0;
    const page = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(backendResponse.total_count / limit);

    return {
      data: backendResponse.results,
      total: backendResponse.total_count,
      page,
      limit,
      totalPages
    };
  } else if (Array.isArray(result)) {
    // Legacy: If API returns just an array, wrap it in pagination response
    const limit = params.limit || 10;
    const skip = params.skip || 0;
    const page = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(result.length / limit);

    return {
      data: result,
      total: result.length,
      page,
      limit,
      totalPages
    };
  } else if (result.data && Array.isArray(result.data)) {
    // Legacy: If API returns paginated response
    return {
      data: result.data,
      total: result.total || result.data.length,
      page: result.page || Math.floor((params.skip || 0) / (params.limit || 10)) + 1,
      limit: result.limit || params.limit || 10,
      totalPages: result.totalPages || Math.ceil((result.total || result.data.length) / (result.limit || params.limit || 10))
    };
  } else {
    // Fallback
    const limit = params.limit || 10;
    const skip = params.skip || 0;
    const page = Math.floor(skip / limit) + 1;

    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 1
    };
  }
}


/**
 * Fetches full Pflicht details by ID
 * @param pflichtId - The ID of the Pflicht to fetch
 * @returns Promise<Pflicht>
 */
export async function getPflichtDetails(pflichtId: number): Promise<Pflicht> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kireon-backend-510702145393.europe-west4.run.app";

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

/**
 * Updates a Pflicht by ID
 * @param pflichtId - The ID of the Pflicht to update
 * @param pflicht - The updated Pflicht data
 * @returns Promise<Pflicht>
 */
export async function updatePflicht(pflichtId: number, pflicht: Pflicht): Promise<Pflicht> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kireon-backend-510702145393.europe-west4.run.app";

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

/**
 * Creates a new Pflicht from URL
 * @param url - The URL to create Pflicht from
 * @returns Promise<Pflicht[]>
 */
export async function createPflichtFromUrl(url: string): Promise<Pflicht[]> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kireon-backend-510702145393.europe-west4.run.app";

  // URL as query parameter, not in body
  const requestUrl = `${baseUrl}/pflicht/create?url=${encodeURIComponent(url)}`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    // Add cache control to help with CORS preflight
    cache: 'no-cache',
  });

  if (!response.ok) {
    const errorText = await response.text();

    // Handle specific error cases
    if (response.status === 409) {
      throw new Error(`Pflichten für diese Dokumenten-ID existieren bereits`);
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

/**
 * Deletes a Pflicht by ID
 * @param pflichtId - The ID of the Pflicht to delete
 * @returns Promise<{message: string}>
 */
export async function deletePflicht(pflichtId: number): Promise<{ message: string }> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kireon-backend-510702145393.europe-west4.run.app";

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

    // Handle specific error cases
    if (response.status === 404) {
      throw new Error('Pflicht nicht gefunden');
    } else if (response.status === 400) {
      throw new Error(`Ungültige Anfrage: ${errorText}`);
    }

    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

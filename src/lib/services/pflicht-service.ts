import { customClient } from '@/lib/api';
import { PflichtPreview, PflichtPreviewSearchParams, PflichtPreviewResponse } from '@/types/pflicht-preview';
import { Pflicht } from '@/types/pflicht';
import { auth } from '@/lib/auth';

/**
 * Service for managing PflichtPreview entries and full Pflicht details
 */

/**
 * Fetches PflichtPreview entries with search and pagination
 * @param params - Search and pagination parameters
 * @returns Promise<PflichtPreview[]>
 */
export async function getPflichtPreviews(params: PflichtPreviewSearchParams = {}): Promise<PflichtPreview[]> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  
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

  return response.json();
}

/**
 * Fetches PflichtPreview entries with pagination metadata
 * @param params - Search and pagination parameters
 * @returns Promise<PflichtPreviewResponse>
 */
export async function getPflichtPreviewsWithPagination(params: PflichtPreviewSearchParams = {}): Promise<PflichtPreviewResponse> {
  const data = await getPflichtPreviews(params);
  const limit = params.limit || 10;
  const skip = params.skip || 0;
  const total = data.length; // Note: This is a simplified implementation
  const page = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages
  };
}

/**
 * Fetches full Pflicht details by ID
 * @param pflichtId - The ID of the Pflicht to fetch
 * @returns Promise<Pflicht>
 */
export async function getPflichtDetails(pflichtId: number): Promise<Pflicht> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

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
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

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
  console.log('createPflichtFromUrl called with URL:', url);
  
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // URL as query parameter, not in body
  const requestUrl = `${baseUrl}/pflicht/create?url=${encodeURIComponent(url)}`;
  console.log('Making request to:', requestUrl);

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error response:', errorText);
    
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
  console.log('Success response:', result);
  return result;
}

/**
 * Deletes a Pflicht by ID
 * @param pflichtId - The ID of the Pflicht to delete
 * @returns Promise<{message: string}>
 */
export async function deletePflicht(pflichtId: number): Promise<{message: string}> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

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

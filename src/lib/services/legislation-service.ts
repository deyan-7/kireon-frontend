import { LegislationEntry, MOCK_LEGISLATION_ENTRIES } from '@/types/legislation-entry';
import { auth } from '@/lib/auth';

/**
 * Service for managing legislation entries (Gesetzestexte)
 */

/**
 * Fetches all existing legislation entries
 * Initially returns mock data, replace with actual API call
 */
export async function getLegislationEntries(): Promise<LegislationEntry[]> {
  // TODO: Replace with actual API call once backend is ready

  // For now, return mock data
  return Promise.resolve(MOCK_LEGISLATION_ENTRIES);
}

/**
 * Helper function to call the structured_data endpoint
 * @param url - The URL to process
 * @returns The raw response from the backend
 */
async function callStructuredDataEndpoint(url: string): Promise<any> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const encodedUrl = encodeURIComponent(url);
  const requestUrl = `${baseUrl}/structured_data?url=${encodedUrl}`;

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
 * Processes a EUR-Lex URL to extract legislation information
 * @param url - The EUR-Lex URL to process
 * @returns A pre-filled LegislationEntry object
 */
export async function processLegislationUrl(url: string): Promise<LegislationEntry> {
  const rawData = await callStructuredDataEndpoint(url);
  
  // Map the backend response to the frontend LegislationEntry model
  const mappedData: LegislationEntry = {
    ...rawData,
    gesetzeskuerzel: rawData.ges_kuerzel || rawData.gesetzeskuerzel,
    textquelle_url: rawData.textquelle || rawData.textquelle_url,
    infoquelle_url: rawData.infoquelle || rawData.infoquelle_url,
  };
  
  return mappedData;
}

/**
 * Creates a new legislation entry in the database
 * @param entryData - The legislation entry data to save
 * @returns The newly created entry with its database ID
 */
export async function createLegislationEntry(entryData: LegislationEntry): Promise<LegislationEntry> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const requestUrl = `${baseUrl}/api/laws`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(entryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Updates an existing legislation entry
 * @param id - The ID of the entry to update
 * @param entryData - The updated entry data
 * @returns The updated entry
 */
export async function updateLegislationEntry(id: string, entryData: Partial<LegislationEntry>): Promise<LegislationEntry> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const requestUrl = `${baseUrl}/api/laws/${id}`;

  const response = await fetch(requestUrl, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(entryData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Deletes a legislation entry
 * @param id - The ID of the entry to delete
 */
export async function deleteLegislationEntry(id: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const requestUrl = `${baseUrl}/api/laws/${id}`;

  const response = await fetch(requestUrl, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }
}

/**
 * Fetches the full details for a single legislation entry, including its full text.
 * @param id - The ID of the entry to fetch
 * @returns The full LegislationEntry object
 */
export async function getLegislationEntryDetails(id: string): Promise<LegislationEntry> {
  const token = await auth.currentUser?.getIdToken();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const requestUrl = `${baseUrl}/api/laws/${id}`;

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}
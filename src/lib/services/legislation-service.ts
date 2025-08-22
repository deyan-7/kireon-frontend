import { customClient } from '@/lib/api';
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
  // return customClient.GET('/api/laws').then(response => response.data);
  
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
  const response = await customClient.POST('/api/laws', {
    body: entryData
  });

  if (response.error) {
    throw new Error(response.error.message || 'Entry could not be saved');
  }

  if (!response.data) {
    throw new Error('No data received from server');
  }

  return response.data as LegislationEntry;
}

/**
 * Updates an existing legislation entry
 * @param id - The ID of the entry to update
 * @param entryData - The updated entry data
 * @returns The updated entry
 */
export async function updateLegislationEntry(id: string, entryData: Partial<LegislationEntry>): Promise<LegislationEntry> {
  const response = await customClient.PATCH(`/api/laws/${id}`, {
    body: entryData
  });

  if (response.error) {
    throw new Error(response.error.message || 'Entry could not be updated');
  }

  if (!response.data) {
    throw new Error('No data received from server');
  }

  return response.data as LegislationEntry;
}

/**
 * Deletes a legislation entry
 * @param id - The ID of the entry to delete
 */
export async function deleteLegislationEntry(id: string): Promise<void> {
  const response = await customClient.DELETE(`/api/laws/${id}`);

  if (response.error) {
    throw new Error(response.error.message || 'Entry could not be deleted');
  }
}

/**
 * Fetches the full details for a single legislation entry, including its full text.
 * @param id - The ID of the entry to fetch
 * @returns The full LegislationEntry object
 */
export async function getLegislationEntryDetails(id: string): Promise<LegislationEntry> {
  // TODO: Replace with an actual API call, e.g., customClient.GET(`/api/laws/${id}`);
  console.log(`Fetching details for entry ID: ${id}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 750));
  
  const entry = MOCK_LEGISLATION_ENTRIES.find(e => e.id === id);
  if (!entry) {
    throw new Error('Legislation entry not found');
  }

  // Ensure mock data has a volltext property
  if (!entry.volltext) {
    entry.volltext = `Vollständiger Text für "${entry.kurztitel}" konnte nicht geladen werden. Dies ist ein Platzhalter.`;
  }
  
  return Promise.resolve(entry);
}
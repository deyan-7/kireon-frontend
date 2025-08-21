import { customClient } from '@/lib/api';
import { LegislationEntry, MOCK_LEGISLATION_ENTRIES } from '@/types/legislation-entry';

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
 * Processes a EUR-Lex URL to extract legislation information
 * @param url - The EUR-Lex URL to process
 * @returns A pre-filled LegislationEntry object
 */
export async function processLegislationUrl(url: string): Promise<LegislationEntry> {
  const response = await customClient.POST('/api/laws/process-from-url', {
    body: { url }
  });

  if (response.error) {
    throw new Error(response.error.message || 'URL could not be processed');
  }

  if (!response.data) {
    throw new Error('No data received from server');
  }

  return response.data as LegislationEntry;
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
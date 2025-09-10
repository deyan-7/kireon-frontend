import { subscribedLaws, LawAcronym, Stichwort } from '@/types/laws';

/**
 * Service for managing law acronyms (Gesetzeskürzel)
 */

/**
 * Fetches all defined law acronyms.
 * Initially returns mock data derived from types/laws.ts,
 * replace with actual API call when ready.
 */
export async function getLawAcronyms(): Promise<LawAcronym[]> {
  // Map the existing Rahmengesetzgebung[] to the new LawAcronym[] format
  const acronyms: LawAcronym[] = subscribedLaws.map(law => ({
    id: law.gesetz, // Use 'gesetz' as a unique ID
    acronym: law.stichwort,
    fullName: law.kurztitel,
    isActive: true, // Default to true as this is not in the source model
  }));

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return Promise.resolve(acronyms);
}
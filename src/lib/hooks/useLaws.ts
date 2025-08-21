import { useState, useMemo, useCallback } from 'react';
import { Rahmengesetzgebung, subscribedLaws } from '@/types/laws';

export const useLaws = () => {
  // The mock data is imported directly. No useEffect is needed for this static data.
  const [laws] = useState<Rahmengesetzgebung[]>(subscribedLaws);
  const [filterText, setFilterText] = useState('');
  const [selectedLaw, setSelectedLaw] = useState<Rahmengesetzgebung | null>(null);

  const filteredLaws = useMemo(() => {
    const lowercasedFilter = filterText.toLowerCase();
    if (!lowercasedFilter) {
      return laws;
    }
    // Filter based on the properties available in the Rahmengesetzgebung interface
    return laws.filter(law =>
      law.kurztitel.toLowerCase().includes(lowercasedFilter) ||
      law.gesetz.toLowerCase().includes(lowercasedFilter) ||
      law.stichwort.toLowerCase().includes(lowercasedFilter) ||
      law.shortTitle.toLowerCase().includes(lowercasedFilter)
    );
  }, [laws, filterText]);

  const selectLaw = useCallback((law: Rahmengesetzgebung) => {
    setSelectedLaw(law);
  }, []);

  const closeDialog = useCallback(() => {
    setSelectedLaw(null);
  }, []);

  return {
    filteredLaws,
    selectedLaw,
    filterText,
    setFilterText,
    selectLaw,
    closeDialog,
  };
};
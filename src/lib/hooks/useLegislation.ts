import { useState, useMemo, useCallback, useEffect } from 'react';
import { LegislationEntry } from '@/types/legislation-entry';
import { getLegislationEntries } from '@/lib/services/legislation-service';

export const useLegislation = () => {
  const [entries, setEntries] = useState<LegislationEntry[]>([]);
  const [filterText, setFilterText] = useState('');
  const [selectedGesetzeskuerzel, setSelectedGesetzeskuerzel] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<LegislationEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        const data = await getLegislationEntries();
        setEntries(data);
      } catch (error) {
        console.error('Failed to load legislation entries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, []);

  const gesetzeskuerzelList = useMemo(() => {
    const kuerzelSet = new Set<string>();
    entries.forEach(entry => {
      if (entry.gesetzeskuerzel) {
        kuerzelSet.add(entry.gesetzeskuerzel);
      }
    });
    return Array.from(kuerzelSet).sort();
  }, [entries]);

  const gesetzeskuerzelCounts = useMemo(() => {
    const counts = new Map<string, number>();
    gesetzeskuerzelList.forEach(kuerzel => {
      const count = entries.filter(entry => entry.gesetzeskuerzel === kuerzel).length;
      counts.set(kuerzel, count);
    });
    return counts;
  }, [entries, gesetzeskuerzelList]);

  const filteredEntries = useMemo(() => {
    let entriesToShow = entries;

    if (selectedGesetzeskuerzel) {
      entriesToShow = entries.filter(entry => entry.gesetzeskuerzel === selectedGesetzeskuerzel);
    }

    const lowercasedFilter = filterText.toLowerCase();
    if (lowercasedFilter) {
      entriesToShow = entriesToShow.filter(entry =>
        Object.values(entry).some(value =>
          String(value).toLowerCase().includes(lowercasedFilter)
        )
      );
    }

    return entriesToShow;
  }, [entries, filterText, selectedGesetzeskuerzel]);

  const selectGesetzeskuerzel = useCallback((kuerzel: string | null) => {
    setSelectedGesetzeskuerzel(kuerzel);
    setFilterText('');
  }, []);

  const selectEntry = useCallback((entry: LegislationEntry) => {
    setSelectedEntry(entry);
  }, []);

  const closeDialog = useCallback(() => {
    setSelectedEntry(null);
  }, []);

  return {
    loading,
    entries,
    gesetzeskuerzelList,
    gesetzeskuerzelCounts,
    filteredEntries,
    selectedEntry,
    filterText,
    selectedGesetzeskuerzel,
    setFilterText,
    selectGesetzeskuerzel,
    selectEntry,
    closeDialog,
  };
};
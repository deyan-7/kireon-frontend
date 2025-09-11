import { useState, useMemo, useCallback, useEffect } from 'react';
import { PflichtPreview, PflichtPreviewSearchParams } from '@/types/pflicht-preview';
import { getPflichtPreviews } from '@/lib/services/pflicht-service';

export const usePflichtPreviews = () => {
  const [previews, setPreviews] = useState<PflichtPreview[]>([]);
  const [filterText, setFilterText] = useState('');
  const [selectedBereich, setSelectedBereich] = useState<string | null>(null);
  const [selectedGesetzeskuerzel, setSelectedGesetzeskuerzel] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<PflichtPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const loadPreviews = useCallback(async (page: number = 1, searchParams: Partial<PflichtPreviewSearchParams> = {}) => {
    try {
      setLoading(true);
      const skip = (page - 1) * itemsPerPage;
      const params: PflichtPreviewSearchParams = {
        skip,
        limit: itemsPerPage,
        sort_by: 'bereich',
        sort_order: 'asc',
        ...searchParams
      };
      
      const data = await getPflichtPreviews(params);
      setPreviews(data);
      setCurrentPage(page);
      // Note: In a real implementation, you'd get total count from the API
      // For now, we'll estimate based on the returned data
      const estimatedTotal = data.length < itemsPerPage ? data.length : (page * itemsPerPage) + 1;
      setTotalCount(estimatedTotal);
      setTotalPages(Math.ceil(estimatedTotal / itemsPerPage));
    } catch (error) {
      console.error('Failed to load pflicht previews:', error);
      setPreviews([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    loadPreviews(1);
  }, [loadPreviews]);

  const bereichList = useMemo(() => {
    const bereichSet = new Set<string>();
    previews.forEach(preview => {
      if (preview.bereich) {
        bereichSet.add(preview.bereich);
      }
    });
    return Array.from(bereichSet).sort();
  }, [previews]);

  const gesetzeskuerzelList = useMemo(() => {
    const kuerzelSet = new Set<string>();
    previews.forEach(preview => {
      if (preview.gesetzeskuerzel) {
        kuerzelSet.add(preview.gesetzeskuerzel);
      }
    });
    return Array.from(kuerzelSet).sort();
  }, [previews]);

  const bereichCounts = useMemo(() => {
    const counts = new Map<string, number>();
    bereichList.forEach(bereich => {
      const count = previews.filter(preview => preview.bereich === bereich).length;
      counts.set(bereich, count);
    });
    return counts;
  }, [previews, bereichList]);

  const gesetzeskuerzelCounts = useMemo(() => {
    const counts = new Map<string, number>();
    gesetzeskuerzelList.forEach(kuerzel => {
      const count = previews.filter(preview => preview.gesetzeskuerzel === kuerzel).length;
      counts.set(kuerzel, count);
    });
    return counts;
  }, [previews, gesetzeskuerzelList]);

  const filteredPreviews = useMemo(() => {
    let previewsToShow = previews;

    if (selectedBereich) {
      previewsToShow = previews.filter(preview => preview.bereich === selectedBereich);
    }

    if (selectedGesetzeskuerzel) {
      previewsToShow = previewsToShow.filter(preview => preview.gesetzeskuerzel === selectedGesetzeskuerzel);
    }

    const lowercasedFilter = filterText.toLowerCase();
    if (lowercasedFilter) {
      previewsToShow = previewsToShow.filter(preview =>
        Object.values(preview).some(value =>
          String(value).toLowerCase().includes(lowercasedFilter)
        )
      );
    }

    return previewsToShow;
  }, [previews, filterText, selectedBereich, selectedGesetzeskuerzel]);

  const selectBereich = useCallback((bereich: string | null) => {
    setSelectedBereich(bereich);
    setFilterText('');
    loadPreviews(1, { bereich: bereich || undefined });
  }, [loadPreviews]);

  const selectGesetzeskuerzel = useCallback((kuerzel: string | null) => {
    setSelectedGesetzeskuerzel(kuerzel);
    setFilterText('');
    loadPreviews(1, { gesetzeskuerzel: kuerzel || undefined });
  }, [loadPreviews]);

  const selectPreview = useCallback((preview: PflichtPreview) => {
    setSelectedPreview(preview);
  }, []);

  const selectPreviewById = useCallback((pflichtId: number) => {
    // This will be handled by the parent component
    // We just need to pass the ID up
  }, []);

  const closeDialog = useCallback(() => {
    setSelectedPreview(null);
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadPreviews(page, {
        bereich: selectedBereich || undefined,
        gesetzeskuerzel: selectedGesetzeskuerzel || undefined,
        thema_search: filterText || undefined
      });
    }
  }, [loadPreviews, totalPages, selectedBereich, selectedGesetzeskuerzel, filterText]);

  const search = useCallback((searchText: string) => {
    setFilterText(searchText);
    loadPreviews(1, {
      bereich: selectedBereich || undefined,
      gesetzeskuerzel: selectedGesetzeskuerzel || undefined,
      thema_search: searchText || undefined
    });
  }, [loadPreviews, selectedBereich, selectedGesetzeskuerzel]);

  return {
    loading,
    previews,
    filteredPreviews,
    bereichList,
    gesetzeskuerzelList,
    bereichCounts,
    gesetzeskuerzelCounts,
    selectedPreview,
    filterText,
    selectedBereich,
    selectedGesetzeskuerzel,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    setFilterText,
    selectBereich,
    selectGesetzeskuerzel,
    selectPreview,
    closeDialog,
    goToPage,
    search,
    loadPreviews
  };
};

import { useState, useMemo, useCallback, useEffect } from 'react';
import { PflichtPreview, PflichtPreviewSearchParams, PflichtPreviewResponse } from '@/types/pflicht-preview';
import { getPflichtPreviews } from '@/lib/services/pflicht-service';

export const usePflichtPreviews = () => {
  const [previews, setPreviews] = useState<PflichtPreview[]>([]);
  const [filterText, setFilterText] = useState('');
  const [selectedBereich, setSelectedBereich] = useState<string | null>(null);
  const [selectedGesetzeskuerzel, setSelectedGesetzeskuerzel] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<PflichtPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const loadPreviews = useCallback(async (page: number = 1, searchParams: Partial<PflichtPreviewSearchParams> = {}, isRefresh: boolean = false) => {
    // Set a timeout to ensure loading state is reset after 30 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 30000);

    try {
      if (isRefresh) {
        setRefreshing(true);
        setLoading(false); // Ensure loading is false when refreshing
      } else {
        setLoading(true);
        setRefreshing(false); // Ensure refreshing is false when loading
      }
      const skip = (page - 1) * itemsPerPage;

      const params: PflichtPreviewSearchParams = {
        skip,
        limit: itemsPerPage,
        sort_by: 'bereich',
        sort_order: 'asc',
        ...searchParams
      };

      const response: PflichtPreviewResponse = await getPflichtPreviews(params);
      setPreviews(response.data);
      setCurrentPage(response.page);
      setTotalCount(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load pflicht previews:', error);
      setPreviews([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      // Clear the timeout since the operation completed
      clearTimeout(timeoutId);

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [itemsPerPage]);

  useEffect(() => {
    // Only load on initial mount
    loadPreviews(1, {}, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

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

    // Calculate counts from current previews (limited to current page data)
    bereichList.forEach(bereich => {
      const count = previews.filter(preview => preview.bereich === bereich).length;
      counts.set(bereich, count);
    });

    return counts;
  }, [previews, bereichList]);

  const gesetzeskuerzelCounts = useMemo(() => {
    const counts = new Map<string, number>();

    // Calculate counts from current previews (limited to current page data)
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
    // Ensure loading is false before starting refresh
    setLoading(false);
    loadPreviews(1, { bereich: bereich || undefined }, true);
  }, [loadPreviews]);

  const selectGesetzeskuerzel = useCallback((kuerzel: string | null) => {
    setSelectedGesetzeskuerzel(kuerzel);
    setFilterText('');
    // Ensure loading is false before starting refresh
    setLoading(false);
    loadPreviews(1, { gesetzeskuerzel: kuerzel || undefined }, true);
  }, [loadPreviews]);

  const selectPreview = useCallback((preview: PflichtPreview) => {
    setSelectedPreview(preview);
  }, []);


  const closeDialog = useCallback(() => {
    setSelectedPreview(null);
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      // Ensure loading is false before starting refresh
      setLoading(false);
      loadPreviews(page, {
        bereich: selectedBereich || undefined,
        gesetzeskuerzel: selectedGesetzeskuerzel || undefined,
        thema_search: filterText || undefined
      }, true);
    }
  }, [loadPreviews, totalPages, selectedBereich, selectedGesetzeskuerzel, filterText]);

  const search = useCallback((searchText: string) => {
    setFilterText(searchText);
    // Ensure loading is false before starting refresh
    setLoading(false);
    loadPreviews(1, {
      bereich: selectedBereich || undefined,
      gesetzeskuerzel: selectedGesetzeskuerzel || undefined,
      thema_search: searchText || undefined
    }, true);
  }, [loadPreviews, selectedBereich, selectedGesetzeskuerzel]);

  return {
    loading,
    refreshing,
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

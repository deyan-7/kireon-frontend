import { useState, useEffect, useCallback } from 'react';
import { getDokumentPreviews } from '@/lib/services/pflicht-service';
import { DokumentPreview, DokumentPreviewSearchParams } from '@/types/pflicht-preview';

export function useDokumentPreviews() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dokumente, setDokumente] = useState<DokumentPreview[]>([]);
  const [filteredDokumente, setFilteredDokumente] = useState<DokumentPreview[]>([]);
  const [bereichList, setBereichList] = useState<string[]>([]);
  const [bereichCounts, setBereichCounts] = useState<Map<string, number>>(new Map());
  const [filterText, setFilterText] = useState('');
  const [selectedBereich, setSelectedBereich] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(50);

  const search = useCallback(async (searchText: string = '', bereich: string | null = null) => {
    try {
      if (dokumente.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const params: DokumentPreviewSearchParams = {
        pagination_offset: (currentPage - 1) * itemsPerPage,
        pagination_size: itemsPerPage,
        bereich: bereich || undefined,
        thema_search: searchText || undefined,
        sort_by: 'extraction_timestamp',
        sort_order: 'desc',
      };

      const response = await getDokumentPreviews(params);
      
      setDokumente(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.total);

      const bereiche = [...new Set(response.data.map(d => d.bereich).filter(Boolean))] as string[];
      setBereichList(bereiche);
      
      const counts = new Map<string, number>();
      response.data.forEach(dokument => {
        if (dokument.bereich) {
          counts.set(dokument.bereich, (counts.get(dokument.bereich) || 0) + 1);
        }
      });
      setBereichCounts(counts);

    } catch (error) {
      console.error('Error fetching dokument previews:', error);
      setDokumente([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, itemsPerPage, dokumente.length]);

  const selectBereich = useCallback((bereich: string | null) => {
    setSelectedBereich(bereich);
    setCurrentPage(1);
    search(filterText, bereich);
  }, [filterText, search]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    let filtered = dokumente;

    if (filterText) {
      const searchLower = filterText.toLowerCase();
      filtered = filtered.filter(dokument => 
        dokument.thema?.toLowerCase().includes(searchLower) ||
        dokument.id.toLowerCase().includes(searchLower) ||
        dokument.gesetzgebung?.toLowerCase().includes(searchLower) ||
        dokument.pflichten.some(pflicht => 
          pflicht.thema?.toLowerCase().includes(searchLower) ||
          pflicht.folgestatus?.toLowerCase().includes(searchLower)
        )
      );
    }

    setFilteredDokumente(filtered);
  }, [dokumente, filterText]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    if (currentPage > 1) {
      search(filterText, selectedBereich);
    }
  }, [currentPage, search, filterText, selectedBereich]);

  return {
    loading,
    refreshing,
    dokumente: filteredDokumente,
    bereichList,
    bereichCounts,
    filterText,
    selectedBereich,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    setFilterText,
    selectBereich,
    goToPage,
    search,
  };
}

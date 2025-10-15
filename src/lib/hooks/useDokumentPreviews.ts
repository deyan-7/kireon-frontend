import { useState, useEffect, useCallback } from 'react';
import { getDokumentPreviews, getDokumentDetails } from '@/lib/services/pflicht-service';
import { DokumentPreview, DokumentPreviewSearchParams } from '@/types/pflicht-preview';
import { Dokument } from '@/types/pflicht';

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
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const updateProcessingIds = useCallback((next: Iterable<string>) => {
    setProcessingIds((prev) => {
      const nextSet = new Set(next);
      if (prev.size === nextSet.size) {
        let identical = true;
        prev.forEach((value) => {
          if (!nextSet.has(value)) {
            identical = false;
          }
        });
        if (identical) {
          return prev;
        }
      }
      return nextSet;
    });
  }, []);

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
      updateProcessingIds(
        response.data.filter((d) => d.creation_status === 'creating').map((d) => d.id),
      );
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
      updateProcessingIds([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, itemsPerPage, dokumente.length, updateProcessingIds]);

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

  useEffect(() => {
    if (processingIds.size === 0) {
      return;
    }

    let cancelled = false;

    const convertToPreview = (doc: Dokument): DokumentPreview => ({
      id: doc.id,
      bereich: doc.bereich,
      gesetzeskuerzel: doc.gesetzeskuerzel,
      gesetzgebung: doc.gesetzgebung,
      dokument_status: doc.dokument_status,
      verfahren_status: doc.verfahren_status,
      extraction_timestamp: doc.extraction_timestamp,
      thema: doc.thema,
      url: doc.url,
      pflichten: doc.pflichten.map((pflicht) => ({
        id: pflicht.id,
        dokument_id: pflicht.dokument_id,
        thema: pflicht.thema,
        stichtag: pflicht.stichtag,
        folgestatus: pflicht.folgestatus,
        produkte: pflicht.produkte,
        laenderkuerzel: pflicht.laenderkuerzel ? [...pflicht.laenderkuerzel] : null,
      })),
      creation_status: doc.creation_status,
      creation_error: doc.creation_error,
      updated_at: doc.updated_at,
      retry_count: doc.retry_count,
    });

    const poll = async () => {
      const ids = Array.from(processingIds);
      const stillProcessing = new Set<string>();

      try {
        const updates = await Promise.all(
          ids.map(async (id) => {
            try {
              const dokument = await getDokumentDetails(id);
              return convertToPreview(dokument);
            } catch (error) {
              console.error(`Fehler beim Aktualisieren des Dokuments ${id}:`, error);
              return null;
            }
          }),
        );

        setDokumente((prev) => {
          let changed = false;
          const byId = new Map(prev.map((d) => [d.id, d]));

          updates.forEach((preview) => {
            if (!preview) {
              return;
            }
            if (preview.creation_status === 'creating') {
              stillProcessing.add(preview.id);
            }
            if (!byId.has(preview.id)) {
              return;
            }
            const previous = byId.get(preview.id)!;
            const merged = { ...previous, ...preview };
            const serializedPrev = JSON.stringify(previous);
            const serializedMerged = JSON.stringify(merged);
            if (serializedPrev !== serializedMerged) {
              byId.set(preview.id, merged);
              changed = true;
            }
          });

          if (!changed) {
            return prev;
          }

          return prev.map((d) => byId.get(d.id) ?? d);
        });
      } finally {
        if (!cancelled) {
          updateProcessingIds(stillProcessing);
        }
      }
    };

    const interval = setInterval(poll, 5000);
    void poll();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [processingIds, updateProcessingIds]);

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

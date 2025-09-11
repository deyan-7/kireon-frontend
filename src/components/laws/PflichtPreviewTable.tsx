import React from 'react';
import { PflichtPreview } from '@/types/pflicht-preview';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './PflichtPreviewTable.module.scss';

interface PflichtPreviewTableProps {
  previews: PflichtPreview[];
  filterText: string;
  onFilterChange: (text: string) => void;
  onSelectPreview: (preview: PflichtPreview) => void;
  onAddNew: () => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const PflichtPreviewTable: React.FC<PflichtPreviewTableProps> = ({
  previews,
  filterText,
  onFilterChange,
  onSelectPreview,
  onAddNew,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Zeige {startItem}-{endItem} von {totalCount} Einträgen
        </div>
        <div className={styles.paginationControls}>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            <ChevronLeft className="h-4 w-4" />
            Zurück
          </Button>
          
          <div className={styles.pageNumbers}>
            {startPage > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className={styles.pageButton}
                >
                  1
                </Button>
                {startPage > 2 && <span className={styles.pageEllipsis}>...</span>}
              </>
            )}
            
            {pageNumbers.map(pageNum => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={styles.pageButton}
              >
                {pageNum}
              </Button>
            ))}
            
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className={styles.pageEllipsis}>...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className={styles.pageButton}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Weiter
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pflichtTable}>
      <div className={styles.filterContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Pflichten durchsuchen..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        <Button 
          onClick={onAddNew}
          className="bg-rose-700 hover:bg-rose-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Neue Pflicht
        </Button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Bereich</th>
              <th>Thema</th>
              <th>Gesetzeskürzel</th>
              <th>Gesetzgebung</th>
            </tr>
          </thead>
          <tbody>
            {previews.map((preview) => (
              <tr
                key={preview.id}
                onClick={() => onSelectPreview(preview)}
                className={styles.clickableRow}
              >
                <td>
                  {preview.bereich && (
                    <span className={styles.bereich}>
                      {preview.bereich}
                    </span>
                  )}
                </td>
                <td>{preview.thema}</td>
                <td>
                  {preview.gesetzeskuerzel && (
                    <span className={styles.stichwort}>
                      {preview.gesetzeskuerzel}
                    </span>
                  )}
                </td>
                <td>{preview.gesetzgebung}</td>
              </tr>
            ))}
            {previews.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.noResults}>
                  Keine Pflichten gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default PflichtPreviewTable;

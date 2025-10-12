import React, { useState } from 'react';
import { DokumentPreview } from '@/types/pflicht-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, MagnifyingGlassIcon, TrashIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { deletePflicht } from '@/lib/services/pflicht-service';
import { submitDokumentFeedback } from '@/lib/services/dokument-feedback-service';
import styles from './DokumentPreviewTable.module.scss';
// Chat trigger moved to Pflicht dialog; no panel trigger in table

interface DokumentPreviewTableProps {
  dokumente: DokumentPreview[];
  filterText: string;
  onFilterChange: (text: string) => void;
  onSelectDokument?: (dokumentId: string) => void;
  onSelectPflicht?: (pflichtId: number) => void;
  onAddNew: () => void;
  onDeleteDokument?: (dokumentId: string) => void;
  onDeletePflicht?: (pflichtId: number) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  refreshing?: boolean;
}

const DokumentPreviewTable: React.FC<DokumentPreviewTableProps> = ({
  dokumente,
  filterText,
  onFilterChange,
  onSelectDokument,
  onSelectPflicht,
  onAddNew,
  onDeleteDokument,
  onDeletePflicht,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  refreshing = false,
}) => {
  const [expandedDokumente, setExpandedDokumente] = useState<Set<string>>(new Set());
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [showNegativeFeedback, setShowNegativeFeedback] = useState<Set<string>>(new Set());
  const [negativeFeedbackMessage, setNegativeFeedbackMessage] = useState<Record<string, string>>({});
  const [feedbackLoading, setFeedbackLoading] = useState<Set<string>>(new Set());
  const [feedbackStates, setFeedbackStates] = useState<Record<string, 'positive' | 'negative' | null>>({});

  const toggleDokument = (dokumentId: string) => {
    setExpandedDokumente(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dokumentId)) {
        newSet.delete(dokumentId);
      } else {
        newSet.add(dokumentId);
      }
      return newSet;
    });
  };

  const toggleTags = (tagKey: string) => {
    setExpandedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tagKey)) {
        newSet.delete(tagKey);
      } else {
        newSet.add(tagKey);
      }
      return newSet;
    });
  };

  const handleDeleteDokument = (dokumentId: string, dokumentThema: string) => {
    if (confirm(`Sind Sie sicher, dass Sie das Dokument "${dokumentThema}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      onDeleteDokument?.(dokumentId);
    }
  };

  const handleDeletePflicht = async (pflichtId: number, pflichtThema: string) => {
    if (confirm(`Sind Sie sicher, dass Sie die Pflicht "${pflichtThema}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      try {
        await deletePflicht(pflichtId);
        onDeletePflicht?.(pflichtId);
      } catch (error) {
        console.error('Fehler beim Löschen der Pflicht:', error);
        alert(`Fehler beim Löschen der Pflicht: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      }
    }
  };

  const handlePositiveFeedback = async (dokumentId: string) => {
    setFeedbackLoading(prev => new Set(prev).add(dokumentId));
    try {
      await submitDokumentFeedback(dokumentId, {
        feedback_type: "positive"
      });
      
      setFeedbackStates(prev => ({
        ...prev,
        [dokumentId]: 'positive'
      }));
      setShowNegativeFeedback(prev => {
        const newSet = new Set(prev);
        newSet.delete(dokumentId);
        return newSet;
      });
      
      alert("Vielen Dank für Ihr positives Feedback!");
    } catch (error) {
      console.error('Fehler beim Senden des positiven Feedbacks:', error);
      alert(`Fehler beim Senden des Feedbacks: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setFeedbackLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(dokumentId);
        return newSet;
      });
    }
  };

  const handleNegativeFeedback = async (dokumentId: string) => {
    const message = negativeFeedbackMessage[dokumentId]?.trim();
    if (!message) {
      alert("Bitte geben Sie eine Nachricht ein.");
      return;
    }

    setFeedbackLoading(prev => new Set(prev).add(dokumentId));
    try {
      await submitDokumentFeedback(dokumentId, {
        feedback_type: "negative",
        message: message
      });
      
      setFeedbackStates(prev => ({
        ...prev,
        [dokumentId]: 'negative'
      }));
      setShowNegativeFeedback(prev => {
        const newSet = new Set(prev);
        newSet.delete(dokumentId);
        return newSet;
      });
      setNegativeFeedbackMessage(prev => ({
        ...prev,
        [dokumentId]: ""
      }));
      
      alert("Vielen Dank für Ihr Feedback!");
    } catch (error) {
      console.error('Fehler beim Senden des negativen Feedbacks:', error);
      alert(`Fehler beim Senden des Feedbacks: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setFeedbackLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(dokumentId);
        return newSet;
      });
    }
  };

  const toggleNegativeFeedback = (dokumentId: string) => {
    setShowNegativeFeedback(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dokumentId)) {
        newSet.delete(dokumentId);
        setNegativeFeedbackMessage(prev => ({
          ...prev,
          [dokumentId]: ""
        }));
      } else {
        newSet.add(dokumentId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const renderLimitedTags = (tags: string[], tagKey: string, maxVisible: number = 2) => {
    if (!tags || tags.length === 0) return null;
    
    const isExpanded = expandedTags.has(tagKey);
    const visibleTags = isExpanded ? tags : tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;
    
    return (
      <div className={styles.tags}>
        {visibleTags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
        {remainingCount > 0 && !isExpanded && (
          <span 
            className={styles.moreBadge} 
            title={`Weitere ${remainingCount} ${remainingCount === 1 ? 'Element' : 'Elemente'} anzeigen`}
            onClick={(e) => {
              e.stopPropagation();
              toggleTags(tagKey);
            }}
          >
            ...
          </span>
        )}
      </div>
    );
  };

  const renderLimitedProduktTags = (produkte: string[], tagKey: string, maxVisible: number = 2) => {
    if (!produkte || produkte.length === 0) return null;
    
    const isExpanded = expandedTags.has(tagKey);
    const visibleProdukte = isExpanded ? produkte : produkte.slice(0, maxVisible);
    const remainingCount = produkte.length - maxVisible;
    
    return (
      <div className={styles.tags}>
        {visibleProdukte.map((produkt, index) => {
          const truncatedProdukt = produkt.length > 25 ? produkt.substring(0, 25) + '...' : produkt;
          return (
            <span 
              key={index} 
              className={styles.tag}
              title={produkt}
            >
              {truncatedProdukt}
            </span>
          );
        })}
        {remainingCount > 0 && !isExpanded && (
          <span 
            className={styles.moreBadge} 
            title={`Weitere ${remainingCount} ${remainingCount === 1 ? 'Produkt' : 'Produkte'} anzeigen`}
            onClick={(e) => {
              e.stopPropagation();
              toggleTags(tagKey);
            }}
          >
            ...
          </span>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className={styles.pageButton}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className={styles.pagination}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Vorherige
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Nächste
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Dokumente durchsuchen..."
              value={filterText}
              onChange={(e) => onFilterChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <Button variant="outline" onClick={onAddNew} className={styles.addButton}>
          <PlusIcon className={styles.addIcon} />
          Neues Dokument
        </Button>
      </div>

      {/* Results info */}
      <div className={styles.resultsInfo}>
        {totalCount > 0 ? (
          <span>
            Zeige {((currentPage - 1) * itemsPerPage) + 1} bis {Math.min(currentPage * itemsPerPage, totalCount)} von {totalCount} Dokumenten
          </span>
        ) : (
          <span>Keine Dokumente gefunden</span>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.expandColumn}></th>
              <th>Dokument-ID</th>
              <th>Thema</th>
              <th>Bereich</th>
              <th>Gesetzeskürzel</th>
              <th>Gesetzgebung</th>
              <th className={styles.actionColumn}></th>
            </tr>
          </thead>
          <tbody>
            {dokumente.map((dokument) => {
              const isExpanded = expandedDokumente.has(dokument.id);
              return (
                <React.Fragment key={dokument.id}>
                  {/* Dokument Row */}
                  <tr
                    className={`${styles.dokumentRow} ${isExpanded ? styles.dokumentRowExpanded : ''}`}
                    onClick={() => onSelectDokument?.(dokument.id)}
                  >
                    <td className={styles.expandCell}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDokument(dokument.id);
                        }}
                        className={styles.expandButton}
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className={styles.chevronIcon} />
                        ) : (
                          <ChevronRightIcon className={styles.chevronIcon} />
                        )}
                      </button>
                    </td>
                    <td className={styles.dokumentId}>
                      {dokument.url ? (
                        <a 
                          href={dokument.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.dokumentLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {dokument.id}
                          <ArrowTopRightOnSquareIcon className={styles.externalLinkIcon} />
                        </a>
                      ) : (
                        dokument.id
                      )}
                    </td>
                    <td className={styles.thema}>{dokument.thema || 'Nicht verfügbar'}</td>
                    <td className={styles.bereich}>
                      {dokument.bereich && (
                        <Badge variant="secondary" className={styles.bereichBadge}>
                          {dokument.bereich}
                        </Badge>
                      )}
                    </td>
                    <td className={styles.gesetzeskuerzel}>
                      {dokument.gesetzeskuerzel && (
                        <Badge variant="outline" className={styles.kuerzelBadge}>
                          {dokument.gesetzeskuerzel}
                        </Badge>
                      )}
                    </td>
                    <td className={styles.gesetzgebung}>{dokument.gesetzgebung || 'Nicht verfügbar'}</td>
                    <td className={styles.actionCell}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDokument(dokument.id, dokument.thema || 'Unbekanntes Dokument');
                        }}
                        className={styles.deleteButton}
                        title="Dokument löschen"
                      >
                        <TrashIcon className={styles.deleteIcon} />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <>
                      <tr className={`${styles.pflichtHeaderRow} ${isExpanded ? styles.expandedSectionRow : ''}`}>
                        <td></td>
                        <td className={styles.pflichtHeaderCell}>Stichtag</td>
                        <td className={styles.pflichtHeaderCell}>Thema</td>
                        <td className={styles.pflichtHeaderCell}>Länder</td>
                        <td className={styles.pflichtHeaderCell}>Produkte</td>
                        <td className={styles.pflichtHeaderCell}>Folgestatus</td>
                        <td></td>
                      </tr>
                      {dokument.pflichten.length > 0 ? (
                        [...dokument.pflichten]
                          .sort((a, b) => {
                            if (!a.stichtag && !b.stichtag) return 0;
                            if (!a.stichtag) return 1;
                            if (!b.stichtag) return -1;
                            return new Date(a.stichtag).getTime() - new Date(b.stichtag).getTime();
                          })
                          .map((pflicht) => (
                                <tr 
                                  key={pflicht.id} 
                                  className={`${styles.pflichtRow} ${isExpanded ? styles.expandedSectionRow : ''}`}
                                  onClick={() => onSelectPflicht?.(pflicht.id)}
                                >
                              <td></td>
                              <td className={styles.pflichtCell}>
                                <span className={styles.pflichtStichtag}>{formatDate(pflicht.stichtag)}</span>
                              </td>
                              <td className={styles.pflichtCell}>
                                <span className={styles.pflichtThema}>{pflicht.thema || 'Nicht verfügbar'}</span>
                              </td>
                              <td className={styles.pflichtCell}>
                                {pflicht.laenderkuerzel && pflicht.laenderkuerzel.length > 0 && (
                                  renderLimitedTags(pflicht.laenderkuerzel, `laender-${pflicht.id}`)
                                )}
                              </td>
                              <td className={styles.pflichtCell}>
                                {pflicht.produkte && pflicht.produkte.length > 0 && (
                                  renderLimitedProduktTags(pflicht.produkte, `produkte-${pflicht.id}`)
                                )}
                              </td>
                              <td className={styles.pflichtCell}>
                                <span className={styles.pflichtFolgestatus}>
                                  {pflicht.folgestatus || '-'}
                                </span>
                              </td>
                              <td className={styles.pflichtCell}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePflicht(pflicht.id, pflicht.thema || 'Unbekannte Pflicht');
                                  }}
                                  className={styles.deleteButton}
                                  title="Pflicht löschen"
                                >
                                  <TrashIcon className={styles.deleteIcon} />
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                            <tr className={`${styles.pflichtRow} ${isExpanded ? styles.expandedSectionRow : ''}`}>
                          <td></td>
                          <td colSpan={6} className={styles.pflichtCell}>
                            <div className={styles.noPflichtenMessage}>
                              Keine Pflichten für dieses Dokument vorhanden.
                            </div>
                          </td>
                        </tr>
                      )}
                      
                      {/* Feedback Row */}
                      <tr className={`${styles.feedbackRow} ${isExpanded ? styles.expandedSectionRow : ''}`}>
                        <td></td>
                        <td colSpan={6} className={styles.feedbackCell}>
                          <div className={styles.feedbackContainer}>
                            <div className={styles.feedbackContent}>
                              <div className={styles.feedbackButtons}>
                                <span className={styles.feedbackQuestion}>Feedback?</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePositiveFeedback(dokument.id);
                                  }}
                                  disabled={feedbackLoading.has(dokument.id)}
                                  className={`${styles.feedbackButton} ${styles.positive} ${feedbackStates[dokument.id] === 'positive' ? styles.feedbackButtonActive : ''}`}
                                  title="Positives Feedback geben"
                                >
                                  <HandThumbUpIcon className={styles.feedbackIcon} />
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNegativeFeedback(dokument.id);
                                  }}
                                  disabled={feedbackLoading.has(dokument.id)}
                                  className={`${styles.feedbackButton} ${
                                    feedbackStates[dokument.id] === 'negative' 
                                      ? `${styles.feedbackButtonActive} ${styles.negative}` 
                                      : showNegativeFeedback.has(dokument.id) 
                                        ? styles.feedbackButtonExpanded 
                                        : ''
                                  }`}
                                  title="Negatives Feedback geben"
                                >
                                  <HandThumbDownIcon className={styles.feedbackIcon} />
                                </button>
                              </div>
                              
                              <div className={styles.metadataContainer}>
                                <div className={styles.metadataItem}>
                                  <span className={styles.metadataLabel}>Dokumentenstatus:</span>
                                  <span className={styles.metadataValue}>{dokument.dokument_status || '-'}</span>
                                </div>
                                <div className={styles.metadataItem}>
                                  <span className={styles.metadataLabel}>Verfahrensstatus:</span>
                                  <span className={styles.metadataValue}>{dokument.verfahren_status || '-'}</span>
                                </div>
                                <div className={styles.metadataItem}>
                                  <span className={styles.metadataLabel}>Erstellt:</span>
                                  <span className={styles.metadataValue}>{formatDateTime(dokument.extraction_timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {showNegativeFeedback.has(dokument.id) && (
                              <div className={styles.negativeFeedbackForm}>
                                <textarea
                                  value={negativeFeedbackMessage[dokument.id] || ''}
                                  onChange={(e) => setNegativeFeedbackMessage(prev => ({
                                    ...prev,
                                    [dokument.id]: e.target.value
                                  }))}
                                  placeholder="Bitte beschreiben Sie, was verbessert werden könnte..."
                                  className={styles.feedbackTextarea}
                                  rows={3}
                                />
                                <div className={styles.feedbackFormActions}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNegativeFeedback(dokument.id);
                                    }}
                                    disabled={feedbackLoading.has(dokument.id) || !negativeFeedbackMessage[dokument.id]?.trim()}
                                    className={styles.submitFeedbackButton}
                                  >
                                    {feedbackLoading.has(dokument.id) ? 'Sende...' : 'Feedback senden'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleNegativeFeedback(dokument.id);
                                    }}
                                    className={styles.cancelFeedbackButton}
                                  >
                                    Abbrechen
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {renderPagination()}

      {refreshing && (
        <div className={styles.refreshingOverlay}>
          <div className={styles.refreshingSpinner} />
          <span>Aktualisiere...</span>
        </div>
      )}
    </div>
  );
};

export default DokumentPreviewTable;

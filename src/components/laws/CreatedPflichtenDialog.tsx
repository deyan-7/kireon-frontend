import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Users, Package, Clock } from 'lucide-react';
import { Pflicht } from '@/types/pflicht';
import styles from './CreatedPflichtenDialog.module.scss';

interface CreatedPflichtenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pflichten: Pflicht[];
}

const CreatedPflichtenDialog: React.FC<CreatedPflichtenDialogProps> = ({
  isOpen,
  onClose,
  pflichten,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPflicht = pflichten[currentIndex];
  const totalCount = pflichten.length;

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!isOpen || !currentPflicht) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            Erstellte Dokumente ({currentIndex + 1} von {totalCount})
          </DialogTitle>
        </DialogHeader>

        {/* Pagination Controls */}
        <div className={styles.paginationControls}>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={styles.paginationButton}
          >
            <ChevronLeft className="h-4 w-4" />
            Vorherige
          </Button>
          <span className={styles.paginationInfo}>
            {currentIndex + 1} von {totalCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentIndex === totalCount - 1}
            className={styles.paginationButton}
          >
            Nächste
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - reuse PflichtDetailDialog structure */}
        <div className={styles.dialogBody}>
          {/* Status Badges */}
          <div className={styles.statusSection}>
            {currentPflicht.bereich && (
              <Badge variant="secondary" className={styles.bereichBadge}>
                {currentPflicht.bereich}
              </Badge>
            )}
            {currentPflicht.gesetzeskuerzel && (
              <Badge variant="outline" className={styles.kuerzelBadge}>
                {currentPflicht.gesetzeskuerzel}
              </Badge>
            )}
          </div>

          {/* Basic Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Grundinformationen</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Dokument ID</label>
                <div className={styles.fieldValue}>{currentPflicht.dokument_id || 'Nicht verfügbar'}</div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Gesetzgebung</label>
                <div className={styles.fieldValue}>{currentPflicht.gesetzgebung || 'Nicht verfügbar'}</div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Stichtag</label>
                <div className={styles.fieldValue}>
                  <div className={styles.iconValue}>
                    <Calendar className="h-4 w-4" />
                    {currentPflicht.stichtag ? new Date(currentPflicht.stichtag).toLocaleDateString('de-DE') : 'Nicht verfügbar'}
                  </div>
                </div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Folgestatus</label>
                <div className={styles.fieldValue}>{currentPflicht.folgestatus || 'Nicht verfügbar'}</div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Markt</label>
                <div className={styles.fieldValue}>
                  {currentPflicht.laenderkuerzel ? (
                    <div>
                      {currentPflicht.laenderkuerzel.join(', ')}
                    </div>
                  ) : (
                    'Nicht verfügbar'
                  )}
                </div>
              </div>

              {currentPflicht.dokument_status && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Dokumentenstatus</label>
                  <div className={styles.fieldValue}>
                    {currentPflicht.dokument_status}
                  </div>
                </div>
              )}

              {currentPflicht.verfahren_status && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Verfahrensstatus</label>
                  <div className={styles.fieldValue}>
                    {currentPflicht.verfahren_status}
                  </div>
                </div>
              )}
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Extraktionszeitpunkt</label>
                <div className={styles.fieldValue}>
                  <div className={styles.iconValue}>
                    <Clock className="h-4 w-4" />
                    {new Date(currentPflicht.extraction_timestamp).toLocaleString('de-DE')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Inhalt</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Thema</label>
                <div className={styles.fieldValue}>{currentPflicht.thema || 'Nicht verfügbar'}</div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Produktbereich</label>
                <div className={styles.fieldValue}>{currentPflicht.produktbereich || 'Nicht verfügbar'}</div>
              </div>
              
              {currentPflicht.produkte && currentPflicht.produkte.length > 0 && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Produkte</label>
                  <div className={styles.fieldValue}>
                    <div className={styles.produkteList}>
                      {currentPflicht.produkte.map((produkt, index) => (
                        <Badge key={index} variant="outline" className={styles.produktBadge}>
                          <Package className="h-3 w-3 mr-1" />
                          {produkt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Information */}
          {currentPflicht.information && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Informationen</h3>
              <div className={styles.fieldValue}>{currentPflicht.information}</div>
            </div>
          )}

          {/* Affected Parties and Outlook */}
          {(currentPflicht.betroffene || currentPflicht.ausblick) && (
            <div className={styles.outlookSection}>
              <h3 className={styles.sectionTitle}>Betroffene und Ausblick</h3>
              {currentPflicht.betroffene && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Betroffene Akteure</label>
                  <div className={styles.fieldValue}>
                    <div className={styles.iconValue}>
                      <Users className="h-4 w-4" />
                      {currentPflicht.betroffene}
                    </div>
                  </div>
                </div>
              )}
              {currentPflicht.ausblick && (
                <div className={styles.fieldGroup} style={{ marginTop: '1.5rem' }}>
                  <label className={styles.fieldLabel}>Ausblick</label>
                  <div className={styles.fieldValue}>{currentPflicht.ausblick}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={onClose}
            className={styles.actionButton}
          >
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatedPflichtenDialog;

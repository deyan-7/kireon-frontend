import React, { useState, useEffect, useCallback } from 'react';
import { Pflicht, Beleg } from '@/types/pflicht';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, AlertCircle, X, BookOpenIcon } from 'lucide-react';
import { getPflichtDetails } from '@/lib/services/pflicht-service';
import styles from './PflichtDetailDialog.module.scss';

interface PflichtDetailDialogProps {
  pflichtId: number | null;
  onClose: () => void;
  onEdit?: () => void;
  onShowBelege: (belege: Beleg[], pflichtThema: string) => void;
}

const PflichtDetailDialog: React.FC<PflichtDetailDialogProps> = ({
  pflichtId,
  onClose,
  onEdit,
  onShowBelege,
}) => {
  const [pflicht, setPflicht] = useState<Pflicht | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPflichtDetails = useCallback(async () => {
    if (!pflichtId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPflichtDetails(pflichtId);
      setPflicht(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Pflicht-Details');
    } finally {
      setLoading(false);
    }
  }, [pflichtId]);

  useEffect(() => {
    if (pflichtId) {
      loadPflichtDetails();
    }
  }, [pflichtId, loadPflichtDetails]);


  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nicht verfügbar';
    try {
      return new Date(dateString).toLocaleDateString('de-DE');
    } catch {
      return dateString;
    }
  };

  if (!pflichtId) return null;

  if (loading) {
    return (
      <Dialog open={!!pflichtId} onOpenChange={onClose}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Lade Pflicht-Details...</DialogTitle>
          </DialogHeader>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p>Lade Pflicht-Details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={!!pflichtId} onOpenChange={onClose}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader className={styles.dialogHeader}>
            <DialogTitle className={styles.dialogTitle}>
              Fehler beim Laden
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className={styles.errorContainer}>
            <AlertCircle className={styles.errorIcon} />
            <p className={styles.errorMessage}>{error}</p>
            <Button onClick={loadPflichtDetails} variant="outline">
              Erneut versuchen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!pflicht) return null;


  return (
    <Dialog open={!!pflichtId} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            {pflicht.thema || 'Pflicht-Details'}
          </DialogTitle>
        </DialogHeader>

        <div className={styles.dialogBody}>
          <div className={styles.compactGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Stichtag</label>
              <div className={styles.fieldValue}>
                <div className={styles.iconValue}>
                  <Calendar className="h-4 w-4" />
                  {formatDate(pflicht.stichtag)}
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Folgestatus</label>
              <div className={styles.fieldValue}>{pflicht.folgestatus || 'Nicht verfügbar'}</div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Markt</label>
              <div className={styles.fieldValue}>
                {pflicht.laenderkuerzel && pflicht.laenderkuerzel.length > 0 ? (
                  <div className={styles.tags}>
                    {pflicht.laenderkuerzel.map((kuerzel, index) => (
                      <Badge key={index} variant="outline" className={styles.tag}>
                        {kuerzel}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  'Nicht verfügbar'
                )}
              </div>
            </div>

            {pflicht.produkte && pflicht.produkte.length > 0 && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Produkte</label>
                <div className={styles.fieldValue}>
                  <div className={styles.produkteList}>
                    {pflicht.produkte.map((produkt, index) => (
                      <Badge key={index} variant="outline" className={styles.produktBadge}>
                        {produkt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {pflicht.information && (
              <div className={styles.fieldGroupFullWidth}>
                <label className={styles.fieldLabel}>Informationen</label>
                <div className={styles.fieldValue}>{pflicht.information}</div>
              </div>
            )}

            {pflicht.verweise && (
              <div className={styles.fieldGroupFullWidth}>
                <label className={styles.fieldLabel}>Verweise</label>
                <div className={styles.fieldValue}>{pflicht.verweise}</div>
              </div>
            )}

            {pflicht.rechtsgrundlage_ref && (
              <div className={styles.fieldGroupFullWidth}>
                <label className={styles.fieldLabel}>Rechtsgrundlage Ref.</label>
                <div className={styles.fieldValue}>{pflicht.rechtsgrundlage_ref}</div>
              </div>
            )}

            {(pflicht.betroffene || pflicht.ausblick) && (
              <div className={styles.bottomRow}>
                {pflicht.ausblick && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Ausblick</label>
                    <div className={styles.fieldValue}>{pflicht.ausblick}</div>
                  </div>
                )}

                {pflicht.betroffene && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Betroffene Akteure</label>
                    <div className={styles.fieldValue}>
                      <div className={styles.iconValue}>
                        <Users className="h-4 w-4" />
                        {pflicht.betroffene}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {pflicht.belege && pflicht.belege.length > 0 && (
              <Button
                variant="outline"
                onClick={() => onShowBelege(pflicht.belege!, pflicht.thema || 'Unbekannte Pflicht')}
                className={styles.actionButton}
              >
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Quellen anzeigen
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className={styles.actionButton}
            >
              Schließen
            </Button>
            {onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                className={styles.actionButton}
              >
                Bearbeiten
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PflichtDetailDialog;

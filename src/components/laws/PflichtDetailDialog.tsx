import React, { useState, useEffect, useCallback } from 'react';
import { Pflicht } from '@/types/pflicht';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Users, Package, Clock, AlertCircle, Trash2, X } from 'lucide-react';
import { getPflichtDetails, deletePflicht } from '@/lib/services/pflicht-service';
import styles from './PflichtDetailDialog.module.scss';

interface PflichtDetailDialogProps {
  pflichtId: number | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PflichtDetailDialog: React.FC<PflichtDetailDialogProps> = ({
  pflichtId,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [pflicht, setPflicht] = useState<Pflicht | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!pflichtId || !onDelete) return;
    
    if (!confirm('Sind Sie sicher, dass Sie diese Pflicht löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    setDeleting(true);
    setError(null);
    
    try {
      await deletePflicht(pflichtId);
      onDelete();
      onClose();
    } catch (err) {
      console.error('Failed to delete pflicht:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen der Pflicht.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nicht verfügbar';
    try {
      return new Date(dateString).toLocaleDateString('de-DE');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Nicht verfügbar';
    try {
      return new Date(dateTimeString).toLocaleString('de-DE');
    } catch {
      return dateTimeString;
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
            {pflicht.titel || pflicht.thema || 'Pflicht-Details'}
          </DialogTitle>
          {pflicht.dokument_information_url && (
            <a
              href={pflicht.dokument_information_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerLink}
            >
              <ExternalLink className="h-4 w-4 inline mr-1" />
              {pflicht.dokument_information_url}
            </a>
          )}
        </DialogHeader>
        
        <div className={styles.dialogBody}>
          {/* Status Badges */}
          <div className={styles.statusSection}>
            {pflicht.bereich && (
              <Badge variant="secondary" className={styles.bereichBadge}>
                {pflicht.bereich}
              </Badge>
            )}
            {pflicht.gesetzeskuerzel && (
              <Badge variant="outline" className={styles.kuerzelBadge}>
                {pflicht.gesetzeskuerzel}
              </Badge>
            )}
          </div>

          {/* Basic Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Grundinformationen</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Dokument ID</label>
                <div className={styles.fieldValue}>{pflicht.dokument_id || 'Nicht verfügbar'}</div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Gesetzgebung</label>
                <div className={styles.fieldValue}>{pflicht.gesetzgebung || 'Nicht verfügbar'}</div>
              </div>
              
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
                  {pflicht.laenderkuerzel ? (
                    <div>
                      {pflicht.laenderkuerzel.join(', ')}
                    </div>
                  ) : (
                    'Nicht verfügbar'
                  )}
                </div>
              </div>
              
              {pflicht.dokument_status && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Dokumentenstatus</label>
                  <div className={styles.fieldValue}>
                    {pflicht.dokument_status}
                  </div>
                </div>
              )}

              {pflicht.verfahren_status && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Verfahrensstatus</label>
                  <div className={styles.fieldValue}>
                    {pflicht.verfahren_status}
                  </div>
                </div>
              )}
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Extraktionszeitpunkt</label>
                <div className={styles.fieldValue}>
                  <div className={styles.iconValue}>
                    <Clock className="h-4 w-4" />
                    {formatDateTime(pflicht.extraction_timestamp)}
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
                <div className={styles.fieldValue}>{pflicht.thema || 'Nicht verfügbar'}</div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Produktbereich</label>
                <div className={styles.fieldValue}>{pflicht.produktbereich || 'Nicht verfügbar'}</div>
              </div>
              
              {pflicht.produkte && pflicht.produkte.length > 0 && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Produkte</label>
                  <div className={styles.fieldValue}>
                    <div className={styles.produkteList}>
                      {pflicht.produkte.map((produkt, index) => (
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
          {pflicht.information && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Informationen</h3>
              <div className={styles.fieldValue}>{pflicht.information}</div>
            </div>
          )}

                  {/* Affected Parties and Outlook */}
                  {(pflicht.betroffene || pflicht.ausblick) && (
                    <div className={styles.outlookSection}>
                      <h3 className={styles.sectionTitle}>Betroffene und Ausblick</h3>
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
                      {pflicht.ausblick && (
                        <div className={styles.fieldGroup} style={{ marginTop: '1.5rem' }}>
                          <label className={styles.fieldLabel}>Ausblick</label>
                          <div className={styles.fieldValue}>{pflicht.ausblick}</div>
                        </div>
                      )}
                    </div>
                  )}

          {/* Actions */}
          <div className={styles.actions}>
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
            {onDelete && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className={styles.actionButton}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deleting ? 'Lösche...' : 'Löschen'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PflichtDetailDialog;

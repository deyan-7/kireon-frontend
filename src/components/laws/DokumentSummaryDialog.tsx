// src/components/laws/DokumentSummaryDialog.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Dokument } from '@/types/pflicht';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getDokumentDetails } from '@/lib/services/pflicht-service';
import { AlertCircle } from 'lucide-react';
import styles from './DokumentSummaryDialog.module.scss';

interface DokumentSummaryDialogProps {
  dokumentId: string | null;
  onClose: () => void;
}

const DokumentSummaryDialog: React.FC<DokumentSummaryDialogProps> = ({
  dokumentId,
  onClose,
}) => {
  const [dokument, setDokument] = useState<Dokument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDokumentDetails = useCallback(async () => {
    if (!dokumentId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getDokumentDetails(dokumentId);
      setDokument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Dokument-Details');
    } finally {
      setLoading(false);
    }
  }, [dokumentId]);

  useEffect(() => {
    if (dokumentId) {
      loadDokumentDetails();
    }
  }, [dokumentId, loadDokumentDetails]);

  if (!dokumentId) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Lade Dokument-Details...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <AlertCircle className={styles.errorIcon} />
          <p className={styles.errorMessage}>{error}</p>
          <Button onClick={loadDokumentDetails} variant="outline" className="mt-4">
            Erneut versuchen
          </Button>
        </div>
      );
    }

    if (!dokument) return null;

    return (
      <div className={styles.dialogBody}>
        <div className={styles.metadataGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Gesetzgebung</label>
            <span className={styles.fieldValue}>{dokument.gesetzgebung || '-'}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Bereich</label>
            <span className={styles.fieldValue}>{dokument.bereich || '-'}</span>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Gesetzeskürzel</label>
            <span className={styles.fieldValue}>{dokument.gesetzeskuerzel || '-'}</span>
          </div>
        </div>
        <div className={styles.summarySection}>
          <h3 className={styles.fieldLabel}>Zusammenfassung</h3>
          <p className={styles.summaryContent}>{dokument.zusammenfassung || 'Keine Zusammenfassung verfügbar.'}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!dokumentId} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            {dokument?.thema || 'Dokument Zusammenfassung'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DokumentSummaryDialog;

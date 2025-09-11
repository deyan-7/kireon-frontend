import React from 'react';
import { PflichtPreview } from '@/types/pflicht-preview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink } from 'lucide-react';
import styles from './PflichtPreviewDialog.module.scss';

interface PflichtPreviewDialogProps {
  preview: PflichtPreview | null;
  onClose: () => void;
  onEdit?: () => void;
}

const PflichtPreviewDialog: React.FC<PflichtPreviewDialogProps> = ({
  preview,
  onClose,
  onEdit,
}) => {
  if (!preview) return null;

  return (
    <Dialog open={!!preview} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            Pflicht-Details
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
        
        <div className={styles.dialogBody}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>ID</label>
            <div className={styles.fieldValue}>{preview.id}</div>
          </div>

          {preview.dokument_id && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Dokument ID</label>
              <div className={styles.fieldValue}>{preview.dokument_id}</div>
            </div>
          )}

          {preview.bereich && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Bereich</label>
              <div className={styles.fieldValue}>
                <Badge variant="secondary" className={styles.bereichBadge}>
                  {preview.bereich}
                </Badge>
              </div>
            </div>
          )}

          {preview.gesetzeskuerzel && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Gesetzeskürzel</label>
              <div className={styles.fieldValue}>
                <Badge variant="outline" className={styles.kuerzelBadge}>
                  {preview.gesetzeskuerzel}
                </Badge>
              </div>
            </div>
          )}

          {preview.gesetzgebung && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Gesetzgebung</label>
              <div className={styles.fieldValue}>{preview.gesetzgebung}</div>
            </div>
          )}

          {preview.thema && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Thema</label>
              <div className={styles.fieldValue}>{preview.thema}</div>
            </div>
          )}

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
                variant="default"
                onClick={onEdit}
                className={styles.actionButton}
              >
                Bearbeiten
              </Button>
            )}
            {preview.dokument_id && (
              <Button
                variant="default"
                onClick={() => {
                  // TODO: Implement navigation to full document
                  console.log('Navigate to document:', preview.dokument_id);
                }}
                className={styles.actionButton}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Volltext anzeigen
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PflichtPreviewDialog;

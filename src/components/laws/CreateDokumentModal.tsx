import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { createDokumentFromUrl } from '@/lib/services/pflicht-service';
import styles from './CreateDokumentModal.module.scss';

interface CreateDokumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateDokumentModal: React.FC<CreateDokumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Bitte geben Sie eine URL ein.');
      return;
    }

    if (loading) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    Promise.resolve().then(async () => {
      try {
        await createDokumentFromUrl(url.trim());
        setSuccess(true);
        setUrl('');

        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
        }, 1500);
        
      } catch (err) {
        console.error('Failed to create dokument:', err);
        let errorMessage = 'Fehler beim Erstellen des Dokuments.';

        if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    });
  };


  const handleClose = () => {
    if (!loading) {
      setUrl('');
      setError(null);
      setSuccess(false);
      setLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            Neues Dokument erstellen
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <Label htmlFor="url" className={styles.fieldLabel}>
              URL der Gesetzesquelle
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://eur-lex.europa.eu/legal-content/..."
              className={styles.urlInput}
              disabled={loading}
              required
            />
            <p className={styles.helpText}>
              Geben Sie die URL des Gesetzestextes ein, aus dem ein neues Dokument und die dazugehörigen Pflichten erstellt werden sollen
            </p>
          </div>

          {error && (
            <Alert className={styles.alert}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          )}

          {success && (
            <Alert className={styles.successAlert}>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Das Dokument konnte erfolgreich erstellt werden! <br/> Die Übersicht wird aktualisiert...
              </AlertDescription>
            </div>
            </Alert>
          )}

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className={styles.actionButton}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={loading || !url.trim()}
              className={styles.actionButton}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Dokument wird erstellt...
                </>
              ) : (
                'Dokument erstellen'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDokumentModal;

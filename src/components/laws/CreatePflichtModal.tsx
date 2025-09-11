import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { createPflichtFromUrl } from '@/lib/services/pflicht-service';
import { Pflicht } from '@/types/pflicht';
import styles from './CreatePflichtModal.module.scss';

interface CreatePflichtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdPflichten: Pflicht[]) => void;
}

const CreatePflichtModal: React.FC<CreatePflichtModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [conflict, setConflict] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Bitte geben Sie eine URL ein.');
      return;
    }

    // Prevent double submission
    if (loading) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    setConflict(false);

    // Use Promise.resolve().then() to make the async operation non-blocking
    Promise.resolve().then(async () => {
      try {
        const createdPflichten = await createPflichtFromUrl(url.trim());
        setSuccess(true);
        setUrl('');
        
        // Call success callback after a short delay to show success message
        setTimeout(() => {
          onSuccess(createdPflichten);
          onClose();
          setSuccess(false);
        }, 1500);
        
      } catch (err) {
        console.error('Failed to create pflicht:', err);
        let errorMessage = 'Fehler beim Erstellen des Dokuments.';
        
        if (err instanceof Error) {
          if (err.message.includes('existieren bereits')) {
            errorMessage = 'Für diese Dokumenten-ID existieren bereits Dokumente.';
          } else if (err.message.includes('Ungültige URL')) {
            errorMessage = 'Die eingegebene URL ist ungültig. Bitte überprüfen Sie die URL.';
          } else if (err.message.includes('URL ist erforderlich')) {
            errorMessage = 'Bitte geben Sie eine URL ein.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleForceCreate = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setConflict(false);
    
    // Use Promise.resolve().then() to make the async operation non-blocking
    Promise.resolve().then(async () => {
      try {
        // Try to create again - this might still fail with 409, but we show the user's intent
        const createdPflichten = await createPflichtFromUrl(url.trim());
        setSuccess(true);
        setUrl('');
        
        setTimeout(() => {
          onSuccess(createdPflichten);
          onClose();
          setSuccess(false);
        }, 1500);
        
      } catch (err) {
        console.error('Failed to force create pflicht:', err);
        setError('Die Dokumente existieren bereits und können nicht erstellt werden.');
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
      setConflict(false);
      setLoading(false);
      onClose();
    }
  };

  // Reset state when modal opens/closes
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
              Geben Sie die URL des Gesetzestextes ein, aus dem ein neues Dokument erstellt werden soll.
            </p>
          </div>

          {error && (
            <Alert className={styles.alert}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </div>
              {conflict && (
                <div className={styles.conflictActions}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleForceCreate}
                    disabled={loading}
                    className={styles.forceButton}
                  >
                    Trotzdem fortfahren
                  </Button>
                </div>
              )}
            </Alert>
          )}

          {success && (
            <Alert className={styles.successAlert}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Dokument erfolgreich erstellt! Die Übersicht wird aktualisiert...
              </AlertDescription>
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
                  Erstelle Dokument...
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

export default CreatePflichtModal;

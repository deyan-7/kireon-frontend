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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Bitte geben Sie eine URL ein.');
      return;
    }

    // Prevent double submission
    if (loading) {
      console.log('Already loading, preventing double submission');
      return;
    }

    console.log('Creating pflicht from URL:', url.trim());
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const createdPflichten = await createPflichtFromUrl(url.trim());
      console.log('Successfully created pflichten:', createdPflichten);
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
      let errorMessage = 'Fehler beim Erstellen der Pflicht.';
      
      if (err instanceof Error) {
        if (err.message.includes('existieren bereits')) {
          errorMessage = 'Für diese Dokumenten-ID existieren bereits Pflichten.';
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
  };

  const handleClose = () => {
    if (!loading) {
      console.log('Closing CreatePflichtModal');
      setUrl('');
      setError(null);
      setSuccess(false);
      setLoading(false);
      onClose();
    }
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log('CreatePflichtModal opened, resetting state');
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
            Neue Pflicht erstellen
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
              Geben Sie die URL des Gesetzestextes ein, aus dem eine neue Pflicht erstellt werden soll.
            </p>
          </div>

          {error && (
            <Alert className={styles.alert}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className={styles.successAlert}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Pflicht erfolgreich erstellt! Die Übersicht wird aktualisiert...
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
              disabled={loading || !url.trim()}
              className={styles.actionButton}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Erstelle Pflicht...
                </>
              ) : (
                'Pflicht erstellen'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePflichtModal;

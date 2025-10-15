import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { initiateDokumentCreation } from '@/lib/services/pflicht-service';
import styles from './CreateDokumentModal.module.scss';

interface CreateDokumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ProcessStatus = 'idle' | 'processing' | 'finished';

const CreateDokumentModal: React.FC<CreateDokumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Single mode state
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  // Batch mode state
  const [batchUrls, setBatchUrls] = useState('');
  const [processStatus, setProcessStatus] = useState<ProcessStatus>('idle');
  const [totalCount, setTotalCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errors, setErrors] = useState<{ url: string; message: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (activeTab === 'single') {
      // Single URL submission logic
      if (!url.trim()) {
        setError('Bitte geben Sie eine URL ein.');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const job = await initiateDokumentCreation(url.trim());
        if (job.creation_status === 'error') {
          const message = job.creation_error || 'Die Erstellung ist zuvor fehlgeschlagen. Bitte versuchen Sie es erneut über die Übersicht.';
          setError(message);
          onSuccess();
          return;
        }
        setSuccess(true);
        setUrl('');

        setTimeout(() => {
          onSuccess();
          handleClose();
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
    } else {
      // Batch URLs submission logic
      const urls = batchUrls
        .split(/[\n,]+/)
        .map(u => u.trim())
        .filter(u => u.startsWith('http'));

      if (urls.length === 0) {
        setError('Bitte geben Sie mindestens eine gültige URL ein.');
        return;
      }

      setProcessStatus('processing');
      setLoading(true);
      setTotalCount(urls.length);
      setSuccessCount(0);
      setErrorCount(0);
      setErrors([]);
      setError(null);

      for (const currentUrl of urls) {
        try {
          const job = await initiateDokumentCreation(currentUrl);
          if (job.creation_status === 'error') {
            throw new Error(job.creation_error || 'Die Erstellung ist zuvor fehlgeschlagen. Bitte prüfen Sie die Übersicht.');
          }
          setSuccessCount(prev => prev + 1);
        } catch (err) {
          setErrorCount(prev => prev + 1);
          setErrors(prev => [...prev, {
            url: currentUrl,
            message: err instanceof Error ? err.message : 'Unbekannter Fehler'
          }]);
        }
      }

      setProcessStatus('finished');
      setLoading(false);
      onSuccess();
    }
  };

  const resetState = () => {
    setUrl('');
    setBatchUrls('');
    setError(null);
    setSuccess(false);
    setLoading(false);
    setProcessStatus('idle');
    setTotalCount(0);
    setSuccessCount(0);
    setErrorCount(0);
    setErrors([]);
    setActiveTab('single');
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setTimeout(resetState, 300);
    }
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'single' | 'batch')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Einzeln</TabsTrigger>
            <TabsTrigger value="batch">Batch</TabsTrigger>
          </TabsList>

          {/* Single URL Tab Content */}
          <TabsContent value="single">
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
                      Das Dokument wird nun im Hintergrund erstellt. <br /> Die Übersicht wird in Kürze aktualisiert.
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
          </TabsContent>

          {/* Batch URLs Tab Content */}
          <TabsContent value="batch">
            <form onSubmit={handleSubmit} className={styles.form}>
              {processStatus === 'idle' && (
                <>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="batch-urls" className={styles.fieldLabel}>
                      URL-Liste
                    </Label>
                    <Textarea
                      id="batch-urls"
                      value={batchUrls}
                      onChange={(e) => setBatchUrls(e.target.value)}
                      placeholder="Fügen Sie URLs ein, getrennt durch Kommas oder Zeilenumbrüche..."
                      className={styles.urlInput}
                      rows={8}
                      disabled={loading}
                    />
                    <p className={styles.helpText}>
                      Jede URL wird als separates Dokument importiert.
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

                  <div className={styles.actions}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className={styles.actionButton}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={!batchUrls.trim()}
                      className={styles.actionButton}
                    >
                      Dokumente erstellen
                    </Button>
                  </div>
                </>
              )}

              {processStatus === 'processing' && (
                <div className={styles.progressDisplay}>
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <p className={styles.progressText}>
                    Dokument {successCount + errorCount + 1} von {totalCount} wird erstellt...
                  </p>
                  <div className={styles.progressStats}>
                    <span className={styles.successStat}>Erfolgreich: {successCount}</span>
                    <span className={styles.errorStat}>Fehlgeschlagen: {errorCount}</span>
                  </div>
                </div>
              )}

              {processStatus === 'finished' && (
                <div className={styles.resultsDisplay}>
                  <h4 className={styles.resultsTitle}>Batch-Verarbeitung abgeschlossen</h4>
                  <p className={styles.resultsSummary}>
                    Erfolgreich erstellt: <strong>{successCount}</strong> von <strong>{totalCount}</strong>
                  </p>

                  {errors.length > 0 && (
                    <div className={styles.errorsSection}>
                      <h5 className={styles.errorsTitle}>Fehlerdetails ({errorCount}):</h5>
                      <ul className={styles.errorsList}>
                        {errors.map((err, i) => (
                          <li key={i} className={styles.errorItem}>
                            <strong>{err.url}</strong>: {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.actions}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        onSuccess();
                        handleClose();
                      }}
                      className={styles.actionButton}
                    >
                      Schließen
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDokumentModal;

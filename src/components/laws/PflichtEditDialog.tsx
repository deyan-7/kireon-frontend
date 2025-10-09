import React, { useState, useEffect, useCallback } from 'react';
import { Pflicht } from '@/types/pflicht';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Users, AlertCircle, X } from 'lucide-react';
import { getPflichtDetails, updatePflicht } from '@/lib/services/pflicht-service';
import styles from './PflichtEditDialog.module.scss';

interface PflichtEditDialogProps {
  pflichtId: number | null;
  onClose: () => void;
  onSave: (updatedPflicht: Pflicht) => void;
}

const PflichtEditDialog: React.FC<PflichtEditDialogProps> = ({
  pflichtId,
  onClose,
  onSave,
}) => {
  const [pflicht, setPflicht] = useState<Pflicht | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPflichtDetails = useCallback(async () => {
    if (!pflichtId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPflichtDetails(pflichtId);
      setPflicht(data);
    } catch (err) {
      console.error('Failed to load pflicht details:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Pflicht-Details.');
    } finally {
      setLoading(false);
    }
  }, [pflichtId]);

  useEffect(() => {
    loadPflichtDetails();
  }, [pflichtId, loadPflichtDetails]);

  const handleInputChange = (field: keyof Pflicht, value: any) => {
    if (!pflicht) return;

    setPflicht(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleArrayChange = (field: keyof Pflicht, value: string) => {
    if (!pflicht) return;

    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setPflicht(prev => prev ? { ...prev, [field]: arrayValue } : prev);
  };

  const handleSave = async () => {
    if (!pflicht || !pflichtId) {
      console.error('Missing pflicht or pflichtId:', { pflicht, pflichtId });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedPflicht = await updatePflicht(pflichtId, pflicht);
      onSave(updatedPflicht);
      onClose();
    } catch (err) {
      console.error('Failed to update pflicht:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern der Änderungen.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch {
      return '';
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
            {pflicht.thema || 'Pflicht bearbeiten'}
          </DialogTitle>
        </DialogHeader>

        <div className={styles.dialogBody}>
          <div className={styles.compactGrid}>
            <div className={styles.fieldGroup}>
              <Label className={styles.fieldLabel}>Stichtag</Label>
              <div className={styles.fieldValue}>
                <div className={styles.iconValue}>
                  <Calendar className="h-4 w-4" />
                  <Input
                    type="date"
                    value={formatDate(pflicht.stichtag)}
                    onChange={(e) => handleInputChange('stichtag', e.target.value ? new Date(e.target.value).toISOString() : null)}
                    className={styles.fieldInput}
                  />
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <Label className={styles.fieldLabel}>Stichtag Typ</Label>
              <Input
                value={pflicht.stichtag_typ || ''}
                onChange={(e) => handleInputChange('stichtag_typ', e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Label className={styles.fieldLabel}>Folgestatus</Label>
              <Input
                value={pflicht.folgestatus || ''}
                onChange={(e) => handleInputChange('folgestatus', e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Label className={styles.fieldLabel}>Markt (kommagetrennt)</Label>
              <Input
                value={pflicht.laenderkuerzel?.join(', ') || ''}
                onChange={(e) => handleArrayChange('laenderkuerzel', e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            {pflicht.produkte && pflicht.produkte.length > 0 && (
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Produkte (kommagetrennt)</Label>
                <Input
                  value={pflicht.produkte.join(', ') || ''}
                  onChange={(e) => handleArrayChange('produkte', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            )}

            {pflicht.information && (
              <div className={styles.fieldGroupFullWidth}>
                <Label className={styles.fieldLabel}>Informationen</Label>
                <Textarea
                  value={pflicht.information || ''}
                  onChange={(e) => handleInputChange('information', e.target.value)}
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            )}

            <div className={styles.fieldGroupFullWidth}>
              <Label className={styles.fieldLabel}>Verweise</Label>
              <Input
                value={pflicht.verweise || ''}
                onChange={(e) => handleInputChange('verweise', e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroupFullWidth}>
              <Label className={styles.fieldLabel}>Rechtsgrundlage Ref.</Label>
              <Input
                value={pflicht.rechtsgrundlage_ref || ''}
                onChange={(e) => handleInputChange('rechtsgrundlage_ref', e.target.value)}
                className={styles.fieldInput}
              />
            </div>

            {(pflicht.betroffene || pflicht.ausblick) && (
              <div className={styles.bottomRow}>
                {pflicht.ausblick && (
                  <div className={styles.fieldGroup}>
                    <Label className={styles.fieldLabel}>Ausblick</Label>
                    <Textarea
                      value={pflicht.ausblick || ''}
                      onChange={(e) => handleInputChange('ausblick', e.target.value)}
                      className={styles.textarea}
                      rows={3}
                    />
                  </div>
                )}

                {pflicht.betroffene && (
                  <div className={styles.fieldGroup}>
                    <Label className={styles.fieldLabel}>Betroffene Akteure</Label>
                    <div className={styles.fieldValue}>
                      <div className={styles.iconValue}>
                        <Users className="h-4 w-4" />
                        <Input
                          value={pflicht.betroffene || ''}
                          onChange={(e) => handleInputChange('betroffene', e.target.value)}
                          className={styles.fieldInput}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              variant="outline"
              onClick={onClose}
              className={styles.actionButton}
              disabled={saving}
            >
              Abbrechen
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              className={styles.actionButton}
              disabled={saving}
            >
              {saving ? 'Speichern...' : 'Speichern'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PflichtEditDialog;
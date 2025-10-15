import React, { useState, useEffect, useCallback } from 'react';
import { Dokument } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { getDokumentDetails, patchObject } from '@/lib/services/pflicht-service';
import { useObjectRefreshStore } from '@/stores/objectRefreshStore';
import styles from './DokumentEditView.module.scss';

interface DokumentEditViewProps {
  dokumentId: string | null;
  onCancel?: () => void;
  onSaved?: (dokument: Dokument) => void;
}

const DokumentEditView: React.FC<DokumentEditViewProps> = ({ dokumentId, onCancel, onSaved }) => {
  const [dokument, setDokument] = useState<Dokument | null>(null);
  const [original, setOriginal] = useState<Dokument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bump = useObjectRefreshStore((s) => s.bump);

  const loadDokumentDetails = useCallback(async () => {
    if (!dokumentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDokumentDetails(dokumentId);
      setDokument(data);
      setOriginal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Dokument-Details.');
    } finally {
      setLoading(false);
    }
  }, [dokumentId]);

  useEffect(() => {
    loadDokumentDetails();
  }, [dokumentId, loadDokumentDetails]);

  const handleInputChange = (field: keyof Dokument, value: any) => {
    setDokument(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!dokument || !dokumentId) return;

    setSaving(true);
    setError(null);

    try {
      const updates: Record<string, any> = {};
      const curr = dokument as any;
      const prev = (original ?? {}) as any;
      const keys = new Set<string>([...Object.keys(curr || {}), ...Object.keys(prev || {})]);
      for (const key of keys) {
        const a = curr?.[key];
        const b = prev?.[key];
        if (JSON.stringify(a) !== JSON.stringify(b)) {
          updates[key] = a;
        }
      }

      if (Object.keys(updates).length > 0) {
        const updated = await patchObject('dokument', dokumentId, updates);
        bump('dokument', dokumentId);
        onSaved?.(updated);
      } else {
        onSaved?.(dokument);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern der Änderungen.');
    } finally {
      setSaving(false);
    }
  };

  if (!dokumentId) return null;

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
        <Button onClick={loadDokumentDetails} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!dokument) return null;

  return (
    <>
      <div className={styles.dialogBody}>
        <div className={styles.fieldGroupFullWidth}>
          <Label className={styles.fieldLabel}>Zusammenfassung</Label>
          <Textarea
            value={dokument.zusammenfassung || ''}
            onChange={(e) => handleInputChange('zusammenfassung', e.target.value)}
            className={styles.textarea}
            rows={8}
          />
        </div>
        <div className={styles.fieldGroupFullWidth}>
          <Label className={styles.fieldLabel}>Notizen</Label>
          <Textarea
            value={dokument.notizen || ''}
            onChange={(e) => handleInputChange('notizen', e.target.value)}
            className={styles.textarea}
            rows={5}
            placeholder="Interne Notizen hinzufügen..."
          />
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="outline" onClick={onCancel} disabled={saving}>Abbrechen</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</Button>
      </div>
    </>
  );
};

export default DokumentEditView;


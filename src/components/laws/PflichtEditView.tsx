import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pflicht } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Users, AlertCircle } from 'lucide-react';
import { getPflichtDetails, patchObject } from '@/lib/services/pflicht-service';
import { useObjectRefreshStore } from '@/stores/objectRefreshStore';
import styles from './PflichtEditDialog.module.scss';

interface PflichtEditViewProps {
  pflichtId: number | null;
  onCancel?: () => void;
  onSaved?: (pflicht: Pflicht) => void;
}

import { useSidebarStore } from '@/stores/sidebarStore';

const PflichtEditView: React.FC<PflichtEditViewProps> = ({ pflichtId, onCancel, onSaved }) => {
  const [pflicht, setPflicht] = useState<Pflicht | null>(null);
  const [original, setOriginal] = useState<Pflicht | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { close, setEditSaveHandler } = useSidebarStore();
  const bump = useObjectRefreshStore((s) => s.bump);
  const saveRef = useRef<() => void>(() => {});

  const loadPflichtDetails = useCallback(async () => {
    if (!pflichtId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPflichtDetails(pflichtId);
      setPflicht(data);
      setOriginal(data);
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
      // compute minimal updates vs original
      const updates: Record<string, any> = {};
      const curr = pflicht as any;
      const prev = (original ?? {}) as any;
      const keys = new Set<string>([...Object.keys(curr || {}), ...Object.keys(prev || {})]);
      for (const key of keys) {
        const a = curr?.[key];
        const b = prev?.[key];
        if (JSON.stringify(a) !== JSON.stringify(b)) {
          updates[key] = a;
        }
      }

      const updated = await patchObject('pflicht', pflichtId, updates);
      bump('pflicht', pflichtId);
      if (onSaved) onSaved(updated);
      else close();
    } catch (err) {
      console.error('Failed to update pflicht:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern der Änderungen.');
    } finally {
      setSaving(false);
    }
  };

  // When used in the sidebar, we expose a stable save handler; in panel mode this is unused
  useEffect(() => {
    saveRef.current = handleSave;
  });
  useEffect(() => {
    const stableInvoker = () => saveRef.current();
    setEditSaveHandler(stableInvoker);
    return () => setEditSaveHandler(null);
  }, [setEditSaveHandler]);

  const ensureArray = <T,>(arr: T[] | null | undefined): T[] => Array.isArray(arr) ? arr : [];

  const handleActorDetailChange = (index: number, field: 'betroffener' | 'handlungsanweisungen', value: string) => {
    setPflicht(prev => {
      if (!prev) return prev;
      const list = ensureArray(prev.details_per_betroffene);
      const updated = [...list];
      const current = updated[index] ?? { betroffener: '', handlungsanweisungen: '' };
      const item = { ...current, [field]: value } as any;
      updated[index] = item;
      return { ...prev, details_per_betroffene: updated };
    });
  };

  const addActorDetail = () => {
    setPflicht(prev => prev ? { ...prev, details_per_betroffene: [...ensureArray(prev.details_per_betroffene), { betroffener: '', handlungsanweisungen: '' }] } : prev);
  };

  const removeActorDetail = (index: number) => {
    setPflicht(prev => {
      if (!prev) return prev;
      const updated = ensureArray(prev.details_per_betroffene).filter((_, i) => i !== index);
      return { ...prev, details_per_betroffene: updated };
    });
  };

  const handleOverrideChange = (index: number, field: 'laenderkuerzel' | 'handlungsanweisungen', value: string) => {
    setPflicht(prev => {
      if (!prev) return prev;
      const list = ensureArray(prev.national_overrides);
      const updated = [...list];
      const current = updated[index] ?? { laenderkuerzel: '', handlungsanweisungen: '' };
      const item = { ...current, [field]: value } as any;
      updated[index] = item;
      return { ...prev, national_overrides: updated };
    });
  };

  const addOverride = () => {
    setPflicht(prev => prev ? { ...prev, national_overrides: [...ensureArray(prev.national_overrides), { laenderkuerzel: '', handlungsanweisungen: '' }] } : prev);
  };

  const removeOverride = (index: number) => {
    setPflicht(prev => {
      if (!prev) return prev;
      const updated = ensureArray(prev.national_overrides).filter((_, i) => i !== index);
      return { ...prev, national_overrides: updated };
    });
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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Lade Pflicht-Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <p className={styles.errorMessage}>{error}</p>
        <Button onClick={loadPflichtDetails} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!pflicht) return null;

  return (
        <>
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

            {/* Actor-specific instructions */}
            <div className={styles.fieldGroupFullWidth}>
              <Label className={styles.fieldLabel}>Handlungsanweisungen je Akteur</Label>
              {ensureArray(pflicht.details_per_betroffene).map((d, i) => (
                <div key={i} className={styles.dynamicFieldItem}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Input
                      placeholder="Betroffener"
                      value={d?.betroffener || ''}
                      onChange={(e) => handleActorDetailChange(i, 'betroffener', e.target.value)}
                    />
                    <Button variant="outline" onClick={() => removeActorDetail(i)}>Entfernen</Button>
                  </div>
                  <Textarea
                    placeholder="Handlungsanweisungen"
                    value={d?.handlungsanweisungen || ''}
                    onChange={(e) => handleActorDetailChange(i, 'handlungsanweisungen', e.target.value)}
                    rows={3}
                    className={styles.textarea}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addActorDetail} className={styles.addButton}>Akteur hinzufügen</Button>
            </div>

            {/* National overrides */}
            <div className={styles.fieldGroupFullWidth}>
              <Label className={styles.fieldLabel}>Nationale Umsetzungen</Label>
              {ensureArray(pflicht.national_overrides).map((o, i) => (
                <div key={i} className={styles.dynamicFieldItem}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Input
                      placeholder="Länderkürzel"
                      value={o?.laenderkuerzel || ''}
                      onChange={(e) => handleOverrideChange(i, 'laenderkuerzel', e.target.value)}
                      style={{ maxWidth: 200 }}
                    />
                    <Button variant="outline" onClick={() => removeOverride(i)}>Entfernen</Button>
                  </div>
                  <Textarea
                    placeholder="Handlungsanweisungen"
                    value={o?.handlungsanweisungen || ''}
                    onChange={(e) => handleOverrideChange(i, 'handlungsanweisungen', e.target.value)}
                    rows={3}
                    className={styles.textarea}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addOverride} className={styles.addButton}>Umsetzung hinzufügen</Button>
            </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="outline" onClick={onCancel ?? close} className={styles.actionButton} disabled={saving}>
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
        </>
  );
};

export default PflichtEditView;

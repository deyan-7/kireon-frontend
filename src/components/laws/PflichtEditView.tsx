import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pflicht, ActorDetails, NationalOverride } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, AlertCircle, Trash2 } from 'lucide-react';
import { getPflichtDetails, patchObject } from '@/lib/services/pflicht-service';
import { useObjectRefreshStore } from '@/stores/objectRefreshStore';
import { useSidebarStore } from '@/stores/sidebarStore';

interface PflichtEditViewProps {
  pflichtId: number | null;
  onCancel?: () => void;
  onSaved?: (pflicht: Pflicht) => void;
}

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
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Pflicht-Details.');
    } finally {
      setLoading(false);
    }
  }, [pflichtId]);

  useEffect(() => {
    loadPflichtDetails();
  }, [pflichtId, loadPflichtDetails]);

  const handleInputChange = (field: keyof Pflicht, value: unknown) => {
    setPflicht((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleArrayChange = (field: keyof Pflicht, value: string) => {
    const arrayValue = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setPflicht((prev) => (prev ? { ...prev, [field]: arrayValue } : prev));
  };

  const ensureActorDetails = (arr: Pflicht['details_per_betroffene']) =>
    Array.isArray(arr) ? arr : [];
  const ensureOverrides = (arr: Pflicht['national_overrides']) =>
    Array.isArray(arr) ? arr : [];

  const handleDynamicListChange = (
    listName: 'details_per_betroffene' | 'national_overrides',
    index: number,
    field: string,
    value: string,
  ) => {
    setPflicht((prev) => {
      if (!prev) return prev;
      if (listName === 'details_per_betroffene') {
        const list = [...ensureActorDetails(prev.details_per_betroffene)];
        list[index] = { ...list[index], [field]: value };
        return { ...prev, details_per_betroffene: list };
      }
      const list = [...ensureOverrides(prev.national_overrides)];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, national_overrides: list };
    });
  };

  const addDynamicListItem = (
    listName: 'details_per_betroffene' | 'national_overrides',
    newItem: Record<string, string>,
  ) => {
    setPflicht((prev) => {
      if (!prev) return prev;
      if (listName === 'details_per_betroffene') {
        return {
          ...prev,
          details_per_betroffene: [...ensureActorDetails(prev.details_per_betroffene), newItem as unknown as ActorDetails],
        };
      }
      return {
        ...prev,
        national_overrides: [...ensureOverrides(prev.national_overrides), newItem as unknown as NationalOverride],
      };
    });
  };

  const removeDynamicListItem = (
    listName: 'details_per_betroffene' | 'national_overrides',
    index: number,
  ) => {
    setPflicht((prev) => {
      if (!prev) return prev;
      if (listName === 'details_per_betroffene') {
        const updatedList = ensureActorDetails(prev.details_per_betroffene).filter((_, i) => i !== index);
        return { ...prev, details_per_betroffene: updatedList };
      }
      const updatedList = ensureOverrides(prev.national_overrides).filter((_, i) => i !== index);
      return { ...prev, national_overrides: updatedList };
    });
  };

  const handleSave = async () => {
    if (!pflicht || !pflichtId) return;

    setSaving(true);
    setError(null);

    try {
      const updates: Record<string, unknown> = {};
      const curr = pflicht as unknown as Record<string, unknown>;
      const prev = (original ?? {}) as unknown as Record<string, unknown>;
      const keys = new Set([...Object.keys(curr), ...Object.keys(prev)]);

      keys.forEach((key) => {
        if (JSON.stringify(curr[key]) !== JSON.stringify(prev[key])) {
          updates[key] = curr[key];
        }
      });

      if (Object.keys(updates).length > 0) {
        const updated = await patchObject('pflicht', pflichtId, updates);
        setPflicht(updated);
        setOriginal(updated);
        bump('pflicht', pflichtId);
        if (onSaved) onSaved(updated);
        else close();
      } else {
        if (onSaved) onSaved(pflicht);
        else close();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern der Änderungen.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    saveRef.current = handleSave;
  });

  useEffect(() => {
    const stableInvoker = () => saveRef.current();
    setEditSaveHandler(stableInvoker);
    return () => setEditSaveHandler(null);
  }, [setEditSaveHandler]);

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
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
        <Skeleton className="h-10 w-10 rounded-full" />
        <span>Lade Pflicht-Details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button onClick={loadPflichtDetails} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!pflicht) return null;

  return (
    <>
      <div className="space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-slate-200 bg-white shadow-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">Allgemeine Informationen</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Stichtag</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formatDate(pflicht.stichtag)}
                    onChange={(e) =>
                      handleInputChange('stichtag', e.target.value ? new Date(e.target.value).toISOString() : null)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stichtag Typ</Label>
                <Input value={pflicht.stichtag_typ || ''} onChange={(e) => handleInputChange('stichtag_typ', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Folgestatus</Label>
                <Input value={pflicht.folgestatus || ''} onChange={(e) => handleInputChange('folgestatus', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Markt (kommagetrennt)</Label>
                <Input
                  value={pflicht.laenderkuerzel?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('laenderkuerzel', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Produkte (kommagetrennt)</Label>
                <Input
                  value={pflicht.produkte?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('produkte', e.target.value)}
                  placeholder="Produkt A, Produkt B"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Informationen</Label>
                <Textarea
                  value={pflicht.information || ''}
                  onChange={(e) => handleInputChange('information', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Verweise</Label>
                <Input value={pflicht.verweise || ''} onChange={(e) => handleInputChange('verweise', e.target.value)} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Rechtsgrundlage Ref.</Label>
                <Input
                  value={pflicht.rechtsgrundlage_ref || ''}
                  onChange={(e) => handleInputChange('rechtsgrundlage_ref', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Ausblick</Label>
                <Textarea value={pflicht.ausblick || ''} onChange={(e) => handleInputChange('ausblick', e.target.value)} rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Betroffene Akteure</Label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={pflicht.betroffene || ''}
                    onChange={(e) => handleInputChange('betroffene', e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 border-slate-200 bg-white shadow-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">Handlungsanweisungen je Akteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {ensureActorDetails(pflicht.details_per_betroffene).map((detail, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-2">
                  <Input
                    placeholder="Betroffener"
                    value={detail?.betroffener || ''}
                    onChange={(e) => handleDynamicListChange('details_per_betroffene', index, 'betroffener', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDynamicListItem('details_per_betroffene', index)}
                    title="Entfernen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Handlungsanweisungen"
                  value={detail?.handlungsanweisungen || ''}
                  onChange={(e) =>
                    handleDynamicListChange('details_per_betroffene', index, 'handlungsanweisungen', e.target.value)
                  }
                  rows={3}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addDynamicListItem('details_per_betroffene', { betroffener: '', handlungsanweisungen: '' })}
            >
              Akteur hinzufügen
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 border-slate-200 bg-white shadow-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">Nationale Umsetzungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {ensureOverrides(pflicht.national_overrides).map((override, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-2">
                  <Input
                    placeholder="Länderkürzel"
                    value={override?.laenderkuerzel || ''}
                    onChange={(e) => handleDynamicListChange('national_overrides', index, 'laenderkuerzel', e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDynamicListItem('national_overrides', index)}
                    title="Entfernen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Handlungsanweisungen"
                  value={override?.handlungsanweisungen || ''}
                  onChange={(e) =>
                    handleDynamicListChange('national_overrides', index, 'handlungsanweisungen', e.target.value)
                  }
                  rows={3}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addDynamicListItem('national_overrides', { laenderkuerzel: '', handlungsanweisungen: '' })}
            >
              Umsetzung hinzufügen
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 border-slate-200 bg-white shadow-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-slate-900">Notizen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-6">
            <Textarea
              value={pflicht.notizen || ''}
              onChange={(e) => handleInputChange('notizen', e.target.value)}
              rows={5}
              placeholder="Interne Notizen hinzufügen..."
            />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel ?? close} disabled={saving}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Speichern...' : 'Änderungen speichern'}
        </Button>
      </div>
    </>
  );
};

export default PflichtEditView;

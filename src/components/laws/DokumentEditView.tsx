import React, { useState, useEffect, useCallback } from 'react';
import { Dokument } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { getDokumentDetails, patchObject } from '@/lib/services/pflicht-service';
import { useObjectRefreshStore } from '@/stores/objectRefreshStore';

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

  const handleInputChange = (field: keyof Dokument, value: string) => {
    setDokument((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!dokument || !dokumentId) return;

    setSaving(true);
    setError(null);

    try {
      const updates: Record<string, unknown> = {};
      const curr = dokument as Record<string, unknown>;
      const prev = (original ?? {}) as Record<string, unknown>;
      const keys = new Set([...Object.keys(curr), ...Object.keys(prev)]);

      keys.forEach((key) => {
        if (JSON.stringify(curr[key]) !== JSON.stringify(prev[key])) {
          updates[key] = curr[key];
        }
      });

      if (Object.keys(updates).length > 0) {
        const updated = await patchObject('dokument', dokumentId, updates);
        bump('dokument', dokumentId);
        setDokument(updated);
        setOriginal(updated);
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
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
        <Skeleton className="h-10 w-10 rounded-full" />
        <span>Lade Dokument-Details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button onClick={loadDokumentDetails} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!dokument) return null;

  return (
    <>
      <Card className="border-l-4 border-l-purple-500 border-slate-200 bg-white shadow-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">Dokument bearbeiten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900">Zusammenfassung</Label>
            <Textarea
              value={dokument.zusammenfassung || ''}
              onChange={(e) => handleInputChange('zusammenfassung', e.target.value)}
              rows={8}
              placeholder="Zusammenfassung aktualisieren"
              className="border-slate-300 bg-white focus-visible:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-900">Notizen</Label>
            <Textarea
              value={dokument.notizen || ''}
              onChange={(e) => handleInputChange('notizen', e.target.value)}
              rows={5}
              placeholder="Interne Notizen hinzufügen..."
              className="border-slate-300 bg-white focus-visible:border-slate-400"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Abbrechen
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Speichern...' : 'Änderungen speichern'}
        </Button>
      </div>
    </>
  );
};

export default DokumentEditView;

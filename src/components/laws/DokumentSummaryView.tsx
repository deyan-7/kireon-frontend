import React, { useState, useEffect, useCallback } from 'react';
import { Comment, Dokument } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { getDokumentDetails } from '@/lib/services/pflicht-service';
import CommentSection from '@/components/laws/CommentSection';
import { useObjectRefreshStore, objectKey } from '@/stores/objectRefreshStore';

const SummaryField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
    <div className="text-sm text-foreground">{value}</div>
  </div>
);

interface DokumentSummaryViewProps {
  dokumentId: string | null;
  onLoaded?: (doc: Dokument) => void;
}

const DokumentSummaryView: React.FC<DokumentSummaryViewProps> = ({ dokumentId, onLoaded }) => {
  const [dokument, setDokument] = useState<Dokument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDokumentDetails = useCallback(async () => {
    if (!dokumentId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getDokumentDetails(dokumentId);
      setDokument(data);
      onLoaded?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Dokument-Details');
    } finally {
      setLoading(false);
    }
  }, [dokumentId, onLoaded]);

  useEffect(() => {
    if (dokumentId) {
      loadDokumentDetails();
    }
  }, [dokumentId, loadDokumentDetails]);

  const refreshTs = useObjectRefreshStore((s) => s.timestamps[objectKey('dokument', dokumentId ?? 'none')]);
  useEffect(() => {
    if (dokumentId && refreshTs) {
      loadDokumentDetails();
    }
  }, [dokumentId, refreshTs, loadDokumentDetails]);

  const handleCommentAdded = (comment: Comment) => {
    setDokument((prev) =>
      prev
        ? {
            ...prev,
            comments: [...(prev.comments ?? []), comment],
          }
        : prev,
    );
  };

  const handleCommentDeleted = (commentId: number) => {
    setDokument((prev) =>
      prev
        ? {
            ...prev,
            comments: prev.comments?.filter((comment) => comment.id !== commentId) ?? [],
          }
        : prev,
    );
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
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500 border-slate-200 bg-white shadow-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">Stammdaten</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          <SummaryField label="Gesetzgebung" value={dokument.gesetzgebung || '–'} />
          <SummaryField label="Bereich" value={dokument.bereich || '–'} />
          <SummaryField label="Gesetzeskürzel" value={dokument.gesetzeskuerzel || '–'} />
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-cyan-500 border-slate-200 bg-white shadow-md">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">Zusammenfassung</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap text-sm text-foreground">
            {dokument.zusammenfassung || 'Keine Zusammenfassung verfügbar.'}
          </p>
        </CardContent>
      </Card>

      {dokument.notizen && (
        <Card className="border-l-4 border-l-amber-500 border-slate-200 bg-white shadow-md">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">Notizen</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap text-sm text-foreground">{dokument.notizen}</p>
          </CardContent>
        </Card>
      )}

      <CommentSection
        objectType="dokument"
        objectId={dokument.id}
        comments={dokument.comments}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />
    </div>
  );
};

export default DokumentSummaryView;

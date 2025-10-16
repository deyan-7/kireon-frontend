import React, { useState, useEffect, useCallback } from 'react';
import { Pflicht } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, AlertCircle, FileText } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import InstructionCard from '@/components/laws/InstructionCard';
import { getPflichtDetails } from '@/lib/services/pflicht-service';
import CommentSection from '@/components/laws/CommentSection';
import { useObjectRefreshStore, objectKey } from '@/stores/objectRefreshStore';

const DetailField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </Label>
    <div className="text-sm text-foreground">{children}</div>
  </div>
);

interface PflichtDetailViewProps {
  pflichtId: number | null;
  onLoaded?: (pflicht: Pflicht) => void;
}

const PflichtDetailView: React.FC<PflichtDetailViewProps> = ({ pflichtId, onLoaded }) => {
  const [pflicht, setPflicht] = useState<Pflicht | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateContext } = useSidebarStore();

  const loadPflichtDetails = useCallback(async () => {
    if (!pflichtId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPflichtDetails(pflichtId);
      setPflicht(data);
      onLoaded?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Pflicht-Details');
    } finally {
      setLoading(false);
    }
  }, [pflichtId, onLoaded]);

  useEffect(() => {
    if (pflichtId) {
      loadPflichtDetails();
    }
  }, [pflichtId, loadPflichtDetails]);

  const refreshTs = useObjectRefreshStore((s) => s.timestamps[objectKey('pflicht', pflichtId ?? 'none')]);
  useEffect(() => {
    if (pflichtId && refreshTs) {
      loadPflichtDetails();
    }
  }, [pflichtId, refreshTs, loadPflichtDetails]);

  useEffect(() => {
    if (pflicht?.belege && pflicht.belege.length > 0) {
      updateContext({ belege: pflicht.belege });
    }
  }, [pflicht?.belege, updateContext]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('de-DE');
    } catch {
      return dateString;
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

  const hasInstructions =
    (pflicht.details_per_betroffene && pflicht.details_per_betroffene.length > 0) ||
    (pflicht.national_overrides && pflicht.national_overrides.length > 0);

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Allgemeine Informationen</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
          <DetailField label="Stichtag">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(pflicht.stichtag)}</span>
            </div>
          </DetailField>

          <DetailField label="Folgestatus">{pflicht.folgestatus || 'N/A'}</DetailField>

          <DetailField label="Markt">
            {pflicht.laenderkuerzel && pflicht.laenderkuerzel.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pflicht.laenderkuerzel.map((kuerzel, index) => (
                  <Badge key={index} variant="secondary">
                    {kuerzel}
                  </Badge>
                ))}
              </div>
            ) : (
              'N/A'
            )}
          </DetailField>

          <DetailField label="Produkte">
            {pflicht.produkte && pflicht.produkte.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pflicht.produkte.map((produkt, index) => (
                  <Badge key={index} variant="secondary">
                    {produkt}
                  </Badge>
                ))}
              </div>
            ) : (
              'N/A'
            )}
          </DetailField>

          {pflicht.information && (
            <div className="md:col-span-2">
              <DetailField label="Informationen">{pflicht.information}</DetailField>
            </div>
          )}

          {pflicht.verweise && (
            <div className="md:col-span-2">
              <DetailField label="Verweise">{pflicht.verweise}</DetailField>
            </div>
          )}

          {pflicht.rechtsgrundlage_ref && (
            <div className="md:col-span-2">
              <DetailField label="Rechtsgrundlage Ref.">{pflicht.rechtsgrundlage_ref}</DetailField>
            </div>
          )}

          {pflicht.ausblick && <DetailField label="Ausblick">{pflicht.ausblick}</DetailField>}

          {pflicht.betroffene && (
            <DetailField label="Betroffene Akteure">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{pflicht.betroffene}</span>
              </div>
            </DetailField>
          )}
        </CardContent>
      </Card>

      {hasInstructions && (
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Handlungsanweisungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pflicht.details_per_betroffene?.map((detail, index) => (
              <InstructionCard key={`actor-${index}`} title={detail.betroffener} instructions={detail.handlungsanweisungen} />
            ))}
            {pflicht.national_overrides?.map((override, index) => (
              <InstructionCard
                key={`override-${index}`}
                title={`Nationale Umsetzung: ${override.laenderkuerzel}`}
                instructions={override.handlungsanweisungen}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {pflicht.notizen && (
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Notizen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-foreground">{pflicht.notizen}</p>
          </CardContent>
        </Card>
      )}

      <CommentSection objectType="pflicht" objectId={pflichtId} comments={pflicht.comments} />
    </div>
  );
};

export default PflichtDetailView;

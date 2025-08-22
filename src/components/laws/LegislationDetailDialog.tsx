'use client';

import { Badge } from '@/components/ui/badge';
import { LegislationEntry } from '@/types/legislation-entry';
import { ExternalLink } from 'lucide-react';
import { LegislationDialogLayout } from './LegislationDialogLayout';

interface LegislationDetailDialogProps {
  entry: LegislationEntry;
  onClose: () => void;
}

export function LegislationDetailDialog({ entry, onClose }: LegislationDetailDialogProps) {
  const description = (
    <>
      <span>{entry.gesetzgebung}</span>
      {entry.gesetzeskuerzel && <Badge variant="outline">{entry.gesetzeskuerzel}</Badge>}
      {entry.status && <Badge>{entry.status}</Badge>}
    </>
  );

  return (
    <LegislationDialogLayout
      title={entry.thema}
      description={description}
      onClose={onClose}
    >
      <div className="py-4">
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <DetailItem label="Produktbereich" value={entry.produktbereich} />
          <DetailItem label="Stichtag" value={entry.stichtag} />
          <DetailItem label="Markt" value={entry.markt} />
          <DetailItem label="Folgestatus" value={entry.folgestatus} />
          <DetailItem label="Bezug" value={entry.bezug} />
          <DetailItem label="Initiative" value={entry.initiative} />
          <DetailItem label="Betroffene Akteure" value={entry.betroffene} />
          <DetailItem label="Zitierte Gesetze" value={entry.zitiert} />
          <DetailLink label="Textquelle" url={entry.textquelle_url} />
          <DetailLink label="Infoquelle" url={entry.infoquelle_url} />
        </div>

        <div className="space-y-4 mt-4">
          <InfoSection title="Wesentliche Informationen" content={entry.information} />
          <InfoSection title="Ausblick & Handlungsempfehlungen" content={entry.ausblick} />
        </div>
      </div>
    </LegislationDialogLayout>
  );
}

// Helper components for the dialog
const DetailItem = ({ label, value }: { label: string, value: string | null | undefined }) => value ? (
  <div className="flex flex-col">
    <span className="font-semibold text-gray-800">{label}</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
) : null;

const DetailLink = ({ label, url }: { label: string, url: string | null | undefined }) => url ? (
  <div className="flex flex-col">
    <span className="font-semibold text-gray-800">{label}</span>
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 truncate">
      <ExternalLink className="w-4 h-4 shrink-0" /> {url}
    </a>
  </div>
) : null;

const InfoSection = ({ title, content }: { title: string, content: string | null | undefined }) => content ? (
  <div>
    <h3 className="font-semibold text-lg mb-2 border-b pb-1">{title}</h3>
    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{content}</p>
  </div>
) : null;
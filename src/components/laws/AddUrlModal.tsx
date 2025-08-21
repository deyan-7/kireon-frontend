'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { processLegislationUrl } from '@/lib/services/legislation-service';
import { LegislationEntry } from '@/types/legislation-entry';

interface AddUrlModalProps {
  onClose: () => void;
  onSuccess: (entry: LegislationEntry) => void;
}

export function AddUrlModal({ onClose, onSuccess }: AddUrlModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Bitte geben Sie eine URL ein');
      return;
    }

    // Basic EUR-Lex URL validation
    if (!url.includes('eur-lex.europa.eu')) {
      setError('Bitte geben Sie eine gültige EUR-Lex URL ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For development, create a mock response
      // TODO: Replace with actual API call when backend is ready
      const mockEntry: LegislationEntry = {
        thema: 'Datenschutz',
        stichwort: 'DSGVO',
        dokument: '2016/679',
        dokument_jahr: 2016,
        gesetzgebung: '(EU) 2016/679',
        gesetzgebung_jahr: 2016,
        kurztitel: 'Datenschutz-Grundverordnung',
        kurztitel_englisch: 'General Data Protection Regulation',
        vollzitat: 'Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates vom 27. April 2016 zum Schutz natürlicher Personen bei der Verarbeitung personenbezogener Daten',
        fundstelle: 'ABl. L 119 vom 4.5.2016, S. 1',
        fundstelle_url: url,
        volltext_url: url,
        status: 'In Kraft' as any,
        stichtag: '2018-05-25',
        rechtsakt: 'Verordnung',
        typ: 'EU-Verordnung',
        rechtsgrundlage: 'Art. 16 AEUV',
        gesetzeskuerzel: 'DSGVO',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, use the actual service
      // const entry = await processLegislationUrl(url);
      
      onSuccess(mockEntry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neuen Gesetzestext hinzufügen</DialogTitle>
            <DialogDescription>
              Geben Sie die EUR-Lex URL ein, um die Gesetzesdaten automatisch zu extrahieren.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">EUR-Lex URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                Beispiel: https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32018R0858
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Verarbeite...' : 'Verarbeiten'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
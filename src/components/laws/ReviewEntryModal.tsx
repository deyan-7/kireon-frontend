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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle } from 'lucide-react';
import { createLegislationEntry } from '@/lib/services/legislation-service';
import { LegislationEntry } from '@/types/legislation-entry';

interface ReviewEntryModalProps {
  entry: LegislationEntry;
  onClose: () => void;
  onSave: (entry: LegislationEntry) => void;
}

export function ReviewEntryModal({ entry, onClose, onSave }: ReviewEntryModalProps) {
  const [formData, setFormData] = useState<LegislationEntry>(entry);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof LegislationEntry,
    value: string | number | null
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // For development, simulate saving
      // TODO: Replace with actual API call when backend is ready
      const savedEntry = { ...formData, id: Date.now().toString() };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, use the actual service
      // const savedEntry = await createLegislationEntry(formData);
      
      onSave(savedEntry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Gesetzestext überprüfen und bearbeiten</DialogTitle>
            <DialogDescription>
              Überprüfen Sie die extrahierten Daten und nehmen Sie bei Bedarf Anpassungen vor.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {/* Column 1 - Core Information */}
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="thema">Thema *</Label>
                  <Input 
                    id="thema" 
                    value={formData.thema} 
                    onChange={(e) => handleInputChange('thema', e.target.value)} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="gesetzeskuerzel">Gesetzeskürzel</Label>
                  <Input 
                    id="gesetzeskuerzel" 
                    value={formData.gesetzeskuerzel || ''} 
                    onChange={(e) => handleInputChange('gesetzeskuerzel', e.target.value)} 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="gesetzgebung">Gesetzgebung *</Label>
                  <Input 
                    id="gesetzgebung" 
                    value={formData.gesetzgebung} 
                    onChange={(e) => handleInputChange('gesetzgebung', e.target.value)} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input 
                    id="status" 
                    value={formData.status || ''} 
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    placeholder="z.B. In Kraft, Entwurf" 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="produktbereich">Produktbereich</Label>
                  <Input 
                    id="produktbereich" 
                    value={formData.produktbereich || ''} 
                    onChange={(e) => handleInputChange('produktbereich', e.target.value)} 
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Column 2 - Timing and Market */}
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="stichtag">Stichtag *</Label>
                  <Input 
                    id="stichtag" 
                    type="date" 
                    value={formData.stichtag} 
                    onChange={(e) => handleInputChange('stichtag', e.target.value)} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="folgestatus">Folgestatus</Label>
                  <Input 
                    id="folgestatus" 
                    value={formData.folgestatus || ''} 
                    onChange={(e) => handleInputChange('folgestatus', e.target.value)} 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="markt">Markt</Label>
                  <Input 
                    id="markt" 
                    value={formData.markt || ''} 
                    onChange={(e) => handleInputChange('markt', e.target.value)}
                    placeholder="z.B. EU, UK, Global" 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="bereich">Bereich</Label>
                  <Input 
                    id="bereich" 
                    value={formData.bereich || ''} 
                    onChange={(e) => handleInputChange('bereich', e.target.value)} 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="initiative">Initiative</Label>
                  <Input 
                    id="initiative" 
                    value={formData.initiative || ''} 
                    onChange={(e) => handleInputChange('initiative', e.target.value)}
                    placeholder="z.B. DOC-Nummer" 
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Column 3 - References and URLs */}
              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="bezug">Bezug</Label>
                  <Input 
                    id="bezug" 
                    value={formData.bezug || ''} 
                    onChange={(e) => handleInputChange('bezug', e.target.value)}
                    placeholder="z.B. Löst 2007/46/EG ab" 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="zitiert">Zitierte Gesetze</Label>
                  <Input 
                    id="zitiert" 
                    value={formData.zitiert || ''} 
                    onChange={(e) => handleInputChange('zitiert', e.target.value)}
                    placeholder="Kommagetrennte Liste" 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="textquelle_url">Textquelle URL</Label>
                  <Input 
                    id="textquelle_url" 
                    type="url" 
                    value={formData.textquelle_url || ''} 
                    onChange={(e) => handleInputChange('textquelle_url', e.target.value)} 
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="infoquelle_url">Infoquelle URL</Label>
                  <Input 
                    id="infoquelle_url" 
                    type="url" 
                    value={formData.infoquelle_url || ''} 
                    onChange={(e) => handleInputChange('infoquelle_url', e.target.value)} 
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Full Width Text Areas */}
              <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
                <div>
                  <Label htmlFor="information">Information (max. 600 Zeichen)</Label>
                  <Textarea 
                    id="information" 
                    value={formData.information || ''} 
                    onChange={(e) => handleInputChange('information', e.target.value)}
                    rows={4}
                    maxLength={600}
                    placeholder="Wesentliche Informationen zum Gesetz"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(formData.information?.length || 0)} / 600 Zeichen
                  </p>
                </div>
                <div>
                  <Label htmlFor="betroffene">Betroffene Akteure</Label>
                  <Textarea 
                    id="betroffene" 
                    value={formData.betroffene || ''} 
                    onChange={(e) => handleInputChange('betroffene', e.target.value)}
                    rows={2}
                    placeholder="z.B. Hersteller, Importeure, Händler"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="ausblick">Ausblick & Handlungsempfehlungen</Label>
                  <Textarea 
                    id="ausblick" 
                    value={formData.ausblick || ''} 
                    onChange={(e) => handleInputChange('ausblick', e.target.value)}
                    rows={3}
                    placeholder="Was müssen betroffene Unternehmen beachten?"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="md:col-span-2 lg:col-span-3">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </ScrollArea>

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
              {loading ? 'Speichere...' : 'Speichern'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
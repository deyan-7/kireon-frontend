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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle } from 'lucide-react';
import { createLegislationEntry } from '@/lib/services/legislation-service';
import { LegislationEntry, LegislationStatus } from '@/types/legislation-entry';

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
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Gesetzestext überprüfen und bearbeiten</DialogTitle>
            <DialogDescription>
              Überprüfen Sie die extrahierten Daten und nehmen Sie bei Bedarf Anpassungen vor.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] px-1">
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="stichwort">Stichwort *</Label>
                  <Input
                    id="stichwort"
                    value={formData.stichwort}
                    onChange={(e) => handleInputChange('stichwort', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Document Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dokument">Dokument *</Label>
                  <Input
                    id="dokument"
                    value={formData.dokument}
                    onChange={(e) => handleInputChange('dokument', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="dokument_jahr">Dokument Jahr</Label>
                  <Input
                    id="dokument_jahr"
                    type="number"
                    value={formData.dokument_jahr || ''}
                    onChange={(e) => handleInputChange('dokument_jahr', e.target.value ? parseInt(e.target.value) : null)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Legislation Information */}
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="gesetzgebung_jahr">Gesetzgebung Jahr</Label>
                  <Input
                    id="gesetzgebung_jahr"
                    type="number"
                    value={formData.gesetzgebung_jahr || ''}
                    onChange={(e) => handleInputChange('gesetzgebung_jahr', e.target.value ? parseInt(e.target.value) : null)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Titles */}
              <div>
                <Label htmlFor="kurztitel">Kurztitel (Deutsch) *</Label>
                <Input
                  id="kurztitel"
                  value={formData.kurztitel}
                  onChange={(e) => handleInputChange('kurztitel', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="kurztitel_englisch">Kurztitel (Englisch)</Label>
                <Input
                  id="kurztitel_englisch"
                  value={formData.kurztitel_englisch || ''}
                  onChange={(e) => handleInputChange('kurztitel_englisch', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="vollzitat">Vollzitat *</Label>
                <Textarea
                  id="vollzitat"
                  value={formData.vollzitat}
                  onChange={(e) => handleInputChange('vollzitat', e.target.value)}
                  required
                  disabled={loading}
                  rows={3}
                />
              </div>

              {/* Publication Information */}
              <div>
                <Label htmlFor="fundstelle">Fundstelle *</Label>
                <Input
                  id="fundstelle"
                  value={formData.fundstelle}
                  onChange={(e) => handleInputChange('fundstelle', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fundstelle_url">Fundstelle URL</Label>
                  <Input
                    id="fundstelle_url"
                    type="url"
                    value={formData.fundstelle_url || ''}
                    onChange={(e) => handleInputChange('fundstelle_url', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="volltext_url">Volltext URL</Label>
                  <Input
                    id="volltext_url"
                    type="url"
                    value={formData.volltext_url || ''}
                    onChange={(e) => handleInputChange('volltext_url', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Status and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as LegislationStatus)}
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LegislationStatus.ENTWURF}>Entwurf</SelectItem>
                      <SelectItem value={LegislationStatus.IN_KRAFT}>In Kraft</SelectItem>
                      <SelectItem value={LegislationStatus.AUFGEHOBEN}>Aufgehoben</SelectItem>
                      <SelectItem value={LegislationStatus.AUSSER_KRAFT}>Außer Kraft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>

              {/* Legal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rechtsakt">Rechtsakt</Label>
                  <Input
                    id="rechtsakt"
                    value={formData.rechtsakt || ''}
                    onChange={(e) => handleInputChange('rechtsakt', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="typ">Typ *</Label>
                  <Input
                    id="typ"
                    value={formData.typ}
                    onChange={(e) => handleInputChange('typ', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rechtsgrundlage">Rechtsgrundlage</Label>
                  <Input
                    id="rechtsgrundlage"
                    value={formData.rechtsgrundlage || ''}
                    onChange={(e) => handleInputChange('rechtsgrundlage', e.target.value)}
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
              </div>

              {/* Additional Fields */}
              <div>
                <Label htmlFor="durchfuehrung_von">Durchführung von</Label>
                <Input
                  id="durchfuehrung_von"
                  value={formData.durchfuehrung_von || ''}
                  onChange={(e) => handleInputChange('durchfuehrung_von', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="richtlinie">Richtlinie</Label>
                <Input
                  id="richtlinie"
                  value={formData.richtlinie || ''}
                  onChange={(e) => handleInputChange('richtlinie', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="anmerkungen">Anmerkungen</Label>
                <Textarea
                  id="anmerkungen"
                  value={formData.anmerkungen || ''}
                  onChange={(e) => handleInputChange('anmerkungen', e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
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
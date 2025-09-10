'use client';

import { useState } from 'react';
import { LegislationEntry } from '@/types/legislation-entry';
import { LegislationDialogLayout } from './LegislationDialogLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Edit } from 'lucide-react';

interface UnifiedLegislationDialogProps {
  entry: LegislationEntry;
  mode: 'view' | 'edit';
  onClose: () => void;
  onSave?: (updatedEntry: LegislationEntry) => void;
  onEdit?: () => void;
  isSaving?: boolean;
}

const DetailItem = ({ label, value }: { label: string; value: string | null | undefined }) => value ? (
    <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-900">{value}</span>
    </div>
) : null;


const InfoSection = ({ title, content, highlight = false }: { title: string; content: string | null | undefined; highlight?: boolean }) => content ? (
    <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className={highlight ? "bg-yellow-50 p-4 rounded-sm" : ""}>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
        </div>
    </div>
) : null;


export function UnifiedLegislationDialog({
  entry,
  mode,
  onClose,
  onSave,
  onEdit,
  isSaving = false,
}: UnifiedLegislationDialogProps) {
  const [formData, setFormData] = useState<LegislationEntry>(entry);

  const handleInputChange = (field: keyof LegislationEntry, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const description = (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {mode === 'edit' ? 'Überprüfen Sie die extrahierten Daten' : ''}
      </span>
      {mode === 'view' && formData.gesetzeskuerzel && (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0">
          {formData.gesetzeskuerzel}
        </Badge>
      )}
      {mode === 'view' && formData.status === 'in Kraft' && (
        <span className="text-sm text-gray-600">{formData.status}</span>
      )}
    </div>
  );

  const dialogFooter = mode === 'edit' ? (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
        Abbrechen
      </Button>
      <Button type="submit" disabled={isSaving} onClick={handleSave}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSaving ? 'Speichere...' : 'Speichern'}
      </Button>
    </div>
  ) : (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Schließen
      </Button>
      {onEdit && (
        <Button type="button" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Bearbeiten
        </Button>
      )}
    </div>
  );
  
  return (
    <LegislationDialogLayout
      title={formData.thema}
      description={description}
      onClose={onClose}
      dialogFooter={dialogFooter}
    >
      <div className="space-y-6">
        {mode === 'view' ? (
          <>
            {/* Weitere Parameter Section */}
            <div className="space-y-4">
              <button 
                type="button"
                className="w-full text-left text-base font-semibold text-gray-900 flex items-center justify-between py-2"
                onClick={() => {}}
              >
                Weitere Parameter
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 pb-4 border-b border-gray-200">
                <DetailItem label="Gesetz:" value={entry.gesetzgebung} />
                <DetailItem label="Englischer Titel:" value={'Regulation on the approval and market surveillance of motor vehicles'} />
              </div>
            </div>

            {/* Informationen Section */}
            <div className="space-y-4">
              <InfoSection 
                title="Informationen" 
                content={entry.information || 'Weitere Informationen zu diesem Rahmengesetz werden hier angezeigt.'}
              />
            </div>

            {/* Konkrete Empfehlungen Section */}
            <div className="space-y-4">
              <InfoSection 
                title="Konkrete Empfehlungen" 
                content={entry.ausblick || 'Handlungsempfehlungen für dieses Rahmengesetz werden hier aufgeführt.'}
                highlight={true}
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <Label htmlFor="thema" className="text-sm font-medium block mb-1">Thema *</Label>
                <Input 
                  id="thema" 
                  value={formData.thema} 
                  onChange={(e) => handleInputChange('thema', e.target.value)} 
                  required 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="stichtag" className="text-sm font-medium block mb-1">Stichtag *</Label>
                <Input 
                  id="stichtag" 
                  type="date" 
                  value={formData.stichtag} 
                  onChange={(e) => handleInputChange('stichtag', e.target.value)} 
                  required 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>

              <div>
                <Label htmlFor="gesetzeskuerzel" className="text-sm font-medium block mb-1">Gesetzeskürzel</Label>
                <Input 
                  id="gesetzeskuerzel" 
                  value={formData.gesetzeskuerzel || ''} 
                  onChange={(e) => handleInputChange('gesetzeskuerzel', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="folgestatus" className="text-sm font-medium block mb-1">Folgestatus</Label>
                <Input 
                  id="folgestatus" 
                  value={formData.folgestatus || ''} 
                  onChange={(e) => handleInputChange('folgestatus', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>

              <div>
                <Label htmlFor="gesetzgebung" className="text-sm font-medium block mb-1">Gesetzgebung *</Label>
                <Input 
                  id="gesetzgebung" 
                  value={formData.gesetzgebung} 
                  onChange={(e) => handleInputChange('gesetzgebung', e.target.value)} 
                  required 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="markt" className="text-sm font-medium block mb-1">Markt</Label>
                <Input 
                  id="markt" 
                  value={formData.markt || ''} 
                  onChange={(e) => handleInputChange('markt', e.target.value)} 
                  placeholder="z.B. EU" 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-medium block mb-1">Status</Label>
                <Input 
                  id="status" 
                  value={formData.status || ''} 
                  onChange={(e) => handleInputChange('status', e.target.value)} 
                  placeholder="z.B. in Kraft" 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="bereich" className="text-sm font-medium block mb-1">Bereich</Label>
                <Input 
                  id="bereich" 
                  value={formData.bereich || ''} 
                  onChange={(e) => handleInputChange('bereich', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>

              <div>
                <Label htmlFor="produktbereich" className="text-sm font-medium block mb-1">Produktbereich</Label>
                <Input 
                  id="produktbereich" 
                  value={formData.produktbereich || ''} 
                  onChange={(e) => handleInputChange('produktbereich', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="initiative" className="text-sm font-medium block mb-1">Initiative</Label>
                <Input 
                  id="initiative" 
                  value={formData.initiative || ''} 
                  onChange={(e) => handleInputChange('initiative', e.target.value)} 
                  placeholder="z.B. DOC-Nummer" 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="bezug" className="text-sm font-medium block mb-1">Bezug</Label>
                <Input 
                  id="bezug" 
                  value={formData.bezug || ''} 
                  onChange={(e) => handleInputChange('bezug', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div>
                <Label htmlFor="zitiert" className="text-sm font-medium block mb-1">Zitierte Gesetze</Label>
                <Input 
                  id="zitiert" 
                  value={formData.zitiert || ''} 
                  onChange={(e) => handleInputChange('zitiert', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="textquelle_url" className="text-sm font-medium block mb-1">Textquelle URL</Label>
                <Input 
                  id="textquelle_url" 
                  type="url" 
                  value={formData.textquelle_url || ''} 
                  onChange={(e) => handleInputChange('textquelle_url', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="infoquelle_url" className="text-sm font-medium block mb-1">Infoquelle URL</Label>
                <Input 
                  id="infoquelle_url" 
                  type="url" 
                  value={formData.infoquelle_url || ''} 
                  onChange={(e) => handleInputChange('infoquelle_url', e.target.value)} 
                  disabled={isSaving}
                  className="border-gray-300 w-full h-8" 
                />
              </div>

              <div className="col-span-2 space-y-4">
                <div>
                  <Label htmlFor="information" className="text-sm font-medium block mb-1">Information (max. 600 Zeichen)</Label>
                  <Textarea 
                    id="information" 
                    value={formData.information || ''} 
                    onChange={(e) => handleInputChange('information', e.target.value)} 
                    rows={3} 
                    maxLength={600} 
                    placeholder="Wesentliche Informationen zum Gesetz" 
                    disabled={isSaving}
                    className="border-gray-300 w-full resize-none min-h-[80px]" 
                  />
                  <p className="text-xs text-gray-500 text-right mt-1">{(formData.information?.length || 0)} / 600</p>
                </div>
                <div>
                  <Label htmlFor="betroffene" className="text-sm font-medium block mb-1">Betroffene Akteure</Label>
                  <Textarea 
                    id="betroffene" 
                    value={formData.betroffene || ''} 
                    onChange={(e) => handleInputChange('betroffene', e.target.value)} 
                    rows={2} 
                    placeholder="z.B. Hersteller, Importeure, deren Produkte unter eine Durchführungs-VO fallen" 
                    disabled={isSaving}
                    className="border-gray-300 w-full resize-none min-h-[80px]" 
                  />
                  <p className="text-xs text-gray-500 text-right mt-1">{(formData.betroffene?.length || 0)} / 600</p>
                </div>
                <div>
                  <Label htmlFor="ausblick" className="text-sm font-medium block mb-1">Ausblick & Handlungsempfehlungen</Label>
                  <Textarea 
                    id="ausblick" 
                    value={formData.ausblick || ''} 
                    onChange={(e) => handleInputChange('ausblick', e.target.value)} 
                    rows={3} 
                    placeholder="Die Berichtigungen gelten bereits, sind aber erst mit Gültigkeit der Rahmenverordnung (EU) 2023/1781 zu berücksichtigen" 
                    disabled={isSaving}
                    className="border-gray-300 w-full resize-none min-h-[80px]" 
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </LegislationDialogLayout>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { Pflicht } from '@/types/pflicht';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Package, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { getPflichtDetails, updatePflicht } from '@/lib/services/pflicht-service';
import styles from './PflichtEditDialog.module.scss';

interface PflichtEditDialogProps {
  pflichtId: number | null;
  onClose: () => void;
  onSave: (updatedPflicht: Pflicht) => void;
}

const PflichtEditDialog: React.FC<PflichtEditDialogProps> = ({
  pflichtId,
  onClose,
  onSave,
}) => {
  const [pflicht, setPflicht] = useState<Pflicht | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPflichtDetails = useCallback(async () => {
    if (!pflichtId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPflichtDetails(pflichtId);
      setPflicht(data);
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
    
    setPflicht(prev => {
      if (!prev) return prev;
      
      if (field === 'jurisdiktion') {
        return {
          ...prev,
          jurisdiktion: {
            ...prev.jurisdiktion,
            ...value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
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
    
    console.log('Saving pflicht with ID:', pflichtId, 'and data:', pflicht);
    
    setSaving(true);
    setError(null);
    
    try {
      const updatedPflicht = await updatePflicht(pflichtId, pflicht);
      onSave(updatedPflicht);
      onClose();
    } catch (err) {
      console.error('Failed to update pflicht:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern der Änderungen.');
    } finally {
      setSaving(false);
    }
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
      <Dialog open={!!pflichtId} onOpenChange={onClose}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Lade Pflicht-Details...</DialogTitle>
          </DialogHeader>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p>Lade Pflicht-Details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={!!pflichtId} onOpenChange={onClose}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>Fehler</DialogTitle>
          </DialogHeader>
          <div className={styles.errorContainer}>
            <AlertCircle className={styles.errorIcon} />
            <p className={styles.errorMessage}>{error}</p>
            <Button onClick={loadPflichtDetails} variant="outline">
              Erneut versuchen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!pflicht) return null;

  return (
    <Dialog open={!!pflichtId} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            Pflicht bearbeiten
          </DialogTitle>
        </DialogHeader>
        
        <div className={styles.dialogBody}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Grundinformationen</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Dokument ID</Label>
                <Input
                  value={pflicht.dokument_id || ''}
                  onChange={(e) => handleInputChange('dokument_id', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Gesetzgebung</Label>
                <Input
                  value={pflicht.gesetzgebung || ''}
                  onChange={(e) => handleInputChange('gesetzgebung', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Stichtag</Label>
                <div className={styles.iconValue}>
                  <Calendar className="h-4 w-4" />
                  <Input
                    type="date"
                    value={formatDate(pflicht.stichtag)}
                    onChange={(e) => handleInputChange('stichtag', e.target.value ? new Date(e.target.value).toISOString() : null)}
                    className={styles.fieldInput}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('stichtag', null)}
                    className={styles.resetButton}
                    title="Stichtag zurücksetzen"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
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
                  value={[
                    pflicht.jurisdiktion?.markt,
                    ...(pflicht.jurisdiktion?.laender || [])
                  ].filter(Boolean).join(', ') || ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                    const markt = values[0] || '';
                    const laender = values.slice(1);
                    handleInputChange('jurisdiktion', { 
                      ...pflicht.jurisdiktion, 
                      markt: markt,
                      laender: laender 
                    });
                  }}
                  className={styles.fieldInput}
                />
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Dokumentenstatus</Label>
                <Select
                  value={pflicht.dokument_status || ''}
                  onValueChange={(value) => handleInputChange('dokument_status', value)}
                >
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="Status wählen">
                      {pflicht.dokument_status || 'Status wählen'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className={styles.selectContent}>
                    <SelectItem value="Entwurf" className={styles.selectItem}>Entwurf</SelectItem>
                    <SelectItem value="Veröffentlicht" className={styles.selectItem}>Veröffentlicht</SelectItem>
                    <SelectItem value="Geändert" className={styles.selectItem}>Geändert</SelectItem>
                    <SelectItem value="Aufgehoben" className={styles.selectItem}>Aufgehoben</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Verfahrensstatus</Label>
                <Select
                  value={pflicht.verfahren_status || ''}
                  onValueChange={(value) => handleInputChange('verfahren_status', value)}
                >
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="Status wählen">
                      {pflicht.verfahren_status || 'Status wählen'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className={styles.selectContent}>
                    <SelectItem value="In Vorbereitung" className={styles.selectItem}>In Vorbereitung</SelectItem>
                    <SelectItem value="In Kraft" className={styles.selectItem}>In Kraft</SelectItem>
                    <SelectItem value="Ausgesetzt" className={styles.selectItem}>Ausgesetzt</SelectItem>
                    <SelectItem value="Beendet" className={styles.selectItem}>Beendet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Extraktionszeitpunkt</Label>
                <div className={styles.fieldValue}>
                  <div className={styles.iconValue}>
                    <Clock className="h-4 w-4" />
                    {new Date(pflicht.extraction_timestamp).toLocaleString('de-DE')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Inhalt</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Thema</Label>
                <Input
                  value={pflicht.thema || ''}
                  onChange={(e) => handleInputChange('thema', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Produktbereich</Label>
                <div className={styles.iconValue}>
                  <Package className="h-4 w-4" />
                  <Input
                    value={pflicht.produktbereich || ''}
                    onChange={(e) => handleInputChange('produktbereich', e.target.value)}
                    className={styles.fieldInput}
                  />
                </div>
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Produkte (kommagetrennt)</Label>
                <Input
                  value={pflicht.produkte?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('produkte', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Informationen</h3>
            <Textarea
              value={pflicht.information_erweitert || ''}
              onChange={(e) => handleInputChange('information_erweitert', e.target.value)}
              className={styles.textarea}
              rows={6}
            />
          </div>

          {/* Affected Parties and Outlook */}
          <div className={styles.outlookSection}>
            <h3 className={styles.sectionTitle}>Betroffene und Ausblick</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Betroffene Akteure</Label>
                <div className={styles.iconValue}>
                  <Users className="h-4 w-4" />
                  <Input
                    value={pflicht.betroffene || ''}
                    onChange={(e) => handleInputChange('betroffene', e.target.value)}
                    className={styles.fieldInput}
                  />
                </div>
              </div>
              
              <div className={styles.fieldGroup}>
                <Label className={styles.fieldLabel}>Ausblick</Label>
                <Textarea
                  value={pflicht.ausblick || ''}
                  onChange={(e) => handleInputChange('ausblick', e.target.value)}
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              variant="outline"
              onClick={onClose}
              className={styles.actionButton}
              disabled={saving}
            >
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PflichtEditDialog;

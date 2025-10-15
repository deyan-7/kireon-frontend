import React, { useState, useEffect, useCallback } from 'react';
import { Pflicht } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, AlertCircle } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import InstructionCard from '@/components/laws/InstructionCard';
import { getPflichtDetails } from '@/lib/services/pflicht-service';
import CommentSection from '@/components/laws/CommentSection';
import { useObjectRefreshStore, objectKey } from '@/stores/objectRefreshStore';
import styles from './PflichtDetailDialog.module.scss';

interface PflichtDetailViewProps { pflichtId: number | null; onLoaded?: (pflicht: Pflicht) => void }

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

  // Invalidate when a bump happens for this Pflicht
  const refreshTs = useObjectRefreshStore((s) => s.timestamps[objectKey('pflicht', pflichtId ?? 'none')]);
  useEffect(() => {
    if (pflichtId && refreshTs) {
      loadPflichtDetails();
    }
  }, [pflichtId, refreshTs, loadPflichtDetails]);

  // Keep header sources icon in sync with loaded belege
  useEffect(() => {
    if (pflicht?.belege && pflicht.belege.length > 0) {
      updateContext({ belege: pflicht.belege });
    }
  }, [pflicht?.belege, updateContext]);


  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nicht verfügbar';
    try {
      return new Date(dateString).toLocaleDateString('de-DE');
    } catch {
      return dateString;
    }
  };

  if (!pflichtId) return null;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Lade Pflicht-Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle className={styles.errorIcon} />
        <p className={styles.errorMessage}>{error}</p>
        <Button onClick={loadPflichtDetails} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!pflicht) return null;

  return (
        <div className={styles.dialogBody}>
          {/* Actions moved to ContextualSidebar header/footer */}
          <div className={styles.compactGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Stichtag</label>
              <div className={styles.fieldValue}>
                <div className={styles.iconValue}>
                  <Calendar className="h-4 w-4" />
                  {formatDate(pflicht.stichtag)}
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Folgestatus</label>
              <div className={styles.fieldValue}>{pflicht.folgestatus || 'Nicht verfügbar'}</div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Markt</label>
              <div className={styles.fieldValue}>
                {pflicht.laenderkuerzel && pflicht.laenderkuerzel.length > 0 ? (
                  <div className={styles.tags}>
                    {pflicht.laenderkuerzel.map((kuerzel, index) => (
                      <Badge key={index} variant="outline" className={styles.tag}>
                        {kuerzel}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  'Nicht verfügbar'
                )}
              </div>
            </div>

            {pflicht.produkte && pflicht.produkte.length > 0 && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Produkte</label>
                <div className={styles.fieldValue}>
                  <div className={styles.produkteList}>
                    {pflicht.produkte.map((produkt, index) => (
                      <Badge key={index} variant="outline" className={styles.produktBadge}>
                        {produkt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {pflicht.information && (
              <div className={styles.fieldGroupFullWidth}>
                <label className={styles.fieldLabel}>Informationen</label>
                <div className={styles.fieldValue}>{pflicht.information}</div>
              </div>
            )}

            {pflicht.verweise && (
              <div className={styles.fieldGroupFullWidth}>
                <label className={styles.fieldLabel}>Verweise</label>
                <div className={styles.fieldValue}>{pflicht.verweise}</div>
              </div>
            )}

            {pflicht.rechtsgrundlage_ref && (
              <div className={styles.fieldGroupFullWidth}>
                <label className={styles.fieldLabel}>Rechtsgrundlage Ref.</label>
                <div className={styles.fieldValue}>{pflicht.rechtsgrundlage_ref}</div>
              </div>
            )}

            {(pflicht.betroffene || pflicht.ausblick) && (
              <div className={styles.bottomRow}>
                {pflicht.ausblick && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Ausblick</label>
                    <div className={styles.fieldValue}>{pflicht.ausblick}</div>
                  </div>
                )}

                {pflicht.betroffene && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Betroffene Akteure</label>
                    <div className={styles.fieldValue}>
                      <div className={styles.iconValue}>
                        <Users className="h-4 w-4" />
                        {pflicht.betroffene}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {(pflicht.details_per_betroffene?.length || pflicht.national_overrides?.length) ? (
            <div className={styles.instructionsSection}>
              <label className={styles.fieldLabel}>Handlungsanweisungen</label>
              <div className={styles.fieldValue}>
                {pflicht.details_per_betroffene?.map((detail, index) => (
                  <InstructionCard key={`actor-${index}`} title={detail.betroffener} instructions={detail.handlungsanweisungen} />
                ))}
                {pflicht.national_overrides?.map((override, index) => (
                  <InstructionCard key={`override-${index}`} title={`Nationale Umsetzung: ${override.laenderkuerzel}`} instructions={override.handlungsanweisungen} />
                ))}
              </div>
            </div>
          ) : null}

          {pflicht.notizen && (
            <div className={styles.instructionsSection}>
              <label className={styles.fieldLabel}>Notizen</label>
              <div className={styles.fieldValue}>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{pflicht.notizen}</p>
              </div>
            </div>
          )}
          <CommentSection
            objectType="pflicht"
            objectId={pflichtId}
            comments={pflicht.comments}
          />
        </div>
  );
};

export default PflichtDetailView;

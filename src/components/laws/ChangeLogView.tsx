import React, { useEffect, useState, useCallback } from 'react';
import { ChangeHistory } from '@/types/pflicht';
import { getChangeHistory, revertChange } from '@/lib/services/pflicht-service';
// Removed revert button per request

interface ChangeLogViewProps {
  objectType: 'pflicht' | 'dokument';
  objectId: number | string;
  refreshKey?: number;
}

const ChangeLogView: React.FC<ChangeLogViewProps> = ({ objectType, objectId, refreshKey }) => {
  const [items, setItems] = useState<ChangeHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChangeHistory(objectType, objectId);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Änderungshistorie');
    } finally {
      setLoading(false);
    }
  }, [objectType, objectId, refreshKey]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRevert = async (historyId: number) => {
    if (!confirm('Diese Änderung wirklich zurücksetzen?')) return;
    try {
      await revertChange(historyId);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler beim Zurücksetzen');
    }
  };

  if (loading) return <div style={{ padding: '1rem' }}>Lade Änderungshistorie...</div>;
  if (error) return <div style={{ padding: '1rem', color: '#b91c1c' }}>{error}</div>;

  // Map technical field names to user-friendly German labels
  const fieldNameMap: Record<string, string> = {
    'stichtag': 'Stichtag',
    'stichtag_typ': 'Stichtag Typ',
    'folgestatus': 'Folgestatus',
    'laenderkuerzel': 'Länder',
    'produkte': 'Produkte',
    'information': 'Informationen',
    'verweise': 'Verweise',
    'rechtsgrundlage_ref': 'Rechtsgrundlage Ref.',
    'ausblick': 'Ausblick',
    'betroffene': 'Betroffene Akteure',
    'details_per_betroffene': 'Handlungsanweisungen je Akteur',
    'betroffener': 'Betroffener',
    'handlungsanweisungen': 'Handlungsanweisungen',
    'national_overrides': 'Nationale Umsetzungen',
    'titel': 'Titel',
    'beschreibung': 'Beschreibung',
  };

  const formatPath = (path?: string) => {
    if (!path) return '';
    const parts = path.split('/').filter(Boolean);

    // Build a readable path
    const readableParts: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Skip numeric indices for top-level arrays
      if (part.match(/^\d+$/)) {
        // Get the index number
        const index = parseInt(part, 10) + 1; // Convert to 1-based
        // Only show index if it's in a nested structure
        if (i > 0) {
          readableParts.push(`#${index}`);
        }
        continue;
      }

      // Map field name or use original
      const readable = fieldNameMap[part] || part;
      readableParts.push(readable);
    }

    return readableParts.join(' → ');
  };

  const fmtVal = (v: any) => {
    if (v === null || v === undefined || v === '') return '—';
    if (typeof v === 'string') return v;
    try {
      const s = JSON.stringify(v);
      return s.length > 60 ? s.slice(0, 57) + '…' : s;
    } catch {
      return String(v);
    }
  };

  const renderDiff = (oldValue: any, newValue: any) => {
    const oldStr = fmtVal(oldValue);
    const newStr = fmtVal(newValue);

    // For long text strings, show full old and new values in colored boxes
    if (typeof oldValue === 'string' && typeof newValue === 'string' &&
        oldValue.length > 50 && newValue.length > 50) {
      return (
        <div style={{ paddingLeft: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            marginBottom: '0.5rem',
            borderLeft: '3px solid #ef4444'
          }}>
            <div style={{ fontWeight: 600, color: '#991b1b', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
              Vorher:
            </div>
            <div style={{ color: '#991b1b', lineHeight: '1.5' }}>
              {oldValue}
            </div>
          </div>
          <div style={{
            backgroundColor: '#dcfce7',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            borderLeft: '3px solid #22c55e'
          }}>
            <div style={{ fontWeight: 600, color: '#166534', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
              Nachher:
            </div>
            <div style={{ color: '#166534', lineHeight: '1.5' }}>
              {newValue}
            </div>
          </div>
        </div>
      );
    }

    // For short strings or non-strings, use simple arrow notation
    return (
      <div style={{ color: '#4b5563', paddingLeft: '0.5rem', fontSize: '0.875rem' }}>
        <span style={{ color: '#dc2626', textDecoration: 'line-through' }}>{oldStr}</span>
        {' → '}
        <span style={{ color: '#16a34a', fontWeight: 500 }}>{newStr}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem', overflowY: 'auto', height: '100%' }}>
      {items.length === 0 && <div>Keine Änderungen vorhanden.</div>}
      {items.map((h) => (
        <div key={h.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{h.applied_by || 'Unbekannt'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{new Date(h.applied_at).toLocaleString('de-DE')}</div>
            </div>
            {h.reverted && (
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Zurückgesetzt</span>
            )}
          </div>

          {/* Friendly change list */}
          <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.75rem' }}>
            {(h.changes || []).map((c: any, idx: number) => {
              const key = formatPath(c.path);

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#374151', fontWeight: 500, fontSize: '0.875rem' }}>{key}</div>
                  {c.op === 'replace' ? (
                    renderDiff(c.old_value, c.value)
                  ) : c.op === 'add' ? (
                    <div style={{ color: '#4b5563', paddingLeft: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#16a34a', fontWeight: 500 }}>Hinzugefügt: {fmtVal(c.value)}</span>
                    </div>
                  ) : c.op === 'remove' ? (
                    <div style={{ color: '#4b5563', paddingLeft: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#dc2626', textDecoration: 'line-through' }}>Entfernt: {fmtVal(c.old_value)}</span>
                    </div>
                  ) : (
                    <div style={{ color: '#4b5563', paddingLeft: '0.5rem', fontSize: '0.875rem' }}>
                      {c.op}: {fmtVal(c.value)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChangeLogView;

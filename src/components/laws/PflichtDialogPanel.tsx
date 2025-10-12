"use client";

import React, { useEffect, useState } from 'react';
import { usePflichtDialogStore } from '@/stores/pflichtDialogStore';
import PflichtDetailView from '@/components/laws/PflichtDetailView';
import PflichtEditView from '@/components/laws/PflichtEditView';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, BookOpen, Pencil, X } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';

const panelStyles: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  width: '70%',
  minWidth: 720,
  maxWidth: 1400,
  height: 'calc(100% - 2rem)',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 30,
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid #e5e7eb',
};

const contentStyles: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
};

const PflichtDialogPanel: React.FC = () => {
  const { isOpen, pflichtId, title, close } = usePflichtDialogStore();
  const { open } = useSidebarStore();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [pflichtData, setPflichtData] = useState<any | null>(null);
  const { updateContext } = useSidebarStore();

  useEffect(() => {
    if (!isOpen) {
      setMode('view');
    }
  }, [isOpen]);

  // Keep sidebar context in sync with current Pflicht title/ids so title and tab enables are correct
  useEffect(() => {
    if (pflichtData && pflichtId) {
      updateContext({
        title: pflichtData?.thema || title || 'Pflicht',
        pflichtId,
        dokumentId: pflichtData?.dokument_id,
        objectType: 'pflicht',
        objectId: pflichtId,
        belege: pflichtData?.belege || [],
      });
    }
  }, [pflichtData, pflichtId, title, updateContext]);

  if (!isOpen || !pflichtId) return null;

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{title || 'Pflicht-Details'}</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              open('chat', {
                pflichtId,
                dokumentId: pflichtData?.dokument_id,
                objectType: 'pflicht',
                objectId: pflichtId,
                title: pflichtData?.thema || title || 'Pflicht',
              })
            }
            title="Chat"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              open('history', {
                objectType: 'pflicht',
                objectId: pflichtId,
                pflichtId,
                dokumentId: pflichtData?.dokument_id,
                title: pflichtData?.thema || title || 'Pflicht',
              })
            }
            title="Verlauf"
          >
            <Clock className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              open('sources', {
                belege: pflichtData?.belege || [],
                pflichtId,
                dokumentId: pflichtData?.dokument_id,
                objectType: 'pflicht',
                objectId: pflichtId,
                title: pflichtData?.thema || title || 'Pflicht',
              })
            }
            title="Quellen"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          {mode === 'view' && (
            <Button variant="ghost" size="icon" onClick={() => setMode('edit')} title="Bearbeiten">
              <Pencil className="h-5 w-5" />
            </Button>
          )}
          <button onClick={close} title="Schließen" style={{ padding: 6 }}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div style={contentStyles}>
        {mode === 'view' ? (
          <PflichtDetailView pflichtId={pflichtId} onLoaded={setPflichtData} />
        ) : (
          <PflichtEditView pflichtId={pflichtId} onCancel={() => setMode('view')} onSaved={() => setMode('view')} />
        )}
      </div>
    </div>
  );
};

export default PflichtDialogPanel;

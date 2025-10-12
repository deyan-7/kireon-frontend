"use client";

import React, { useEffect, useState } from 'react';
import { useDokumentDialogStore } from '@/stores/dokumentDialogStore';
import DokumentSummaryView from '@/components/laws/DokumentSummaryView';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, X } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { Dokument } from '@/types/pflicht';

const panelStyles: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  width: '50%',
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

const DokumentDialogPanel: React.FC = () => {
  const { isOpen, dokumentId, title, close } = useDokumentDialogStore();
  const { open, updateContext } = useSidebarStore();
  const [doc, setDoc] = useState<Dokument | null>(null);

  useEffect(() => {
    if (doc && dokumentId) {
      updateContext({
        title: doc?.thema || title || 'Dokument',
        dokumentId,
        objectType: 'dokument',
        objectId: dokumentId,
      });
    }
  }, [doc, dokumentId, title, updateContext]);

  if (!isOpen || !dokumentId) return null;

  return (
    <div style={panelStyles}>
      <div style={headerStyles}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{doc?.thema || title || 'Dokument'}</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => open('chat', { dokumentId, objectType: 'dokument', objectId: dokumentId, title: doc?.thema || title || 'Dokument' })}
            title="Chat"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => open('history', { dokumentId, objectType: 'dokument', objectId: dokumentId, title: doc?.thema || title || 'Dokument' })}
            title="Verlauf"
          >
            <Clock className="h-5 w-5" />
          </Button>
          <button onClick={close} title="Schließen" style={{ padding: 6 }}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div style={contentStyles}>
        <DokumentSummaryView dokumentId={dokumentId} onLoaded={setDoc} />
      </div>
    </div>
  );
};

export default DokumentDialogPanel;


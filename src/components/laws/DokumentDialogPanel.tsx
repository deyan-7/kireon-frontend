"use client";

import React, { useEffect, useState } from 'react';
import { useDokumentDialogStore } from '@/stores/dokumentDialogStore';
import DokumentSummaryView from '@/components/laws/DokumentSummaryView';
import DokumentEditView from '@/components/laws/DokumentEditView';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Clock, Pencil, X } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { Dokument } from '@/types/pflicht';

const DokumentDialogPanel: React.FC = () => {
  const { isOpen, dokumentId, title, close } = useDokumentDialogStore();
  const { open, updateContext } = useSidebarStore();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [dokumentData, setDokumentData] = useState<Dokument | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMode('view');
      setDokumentData(null);
    }
  }, [isOpen]);

  const headerTitle = dokumentData?.thema || title || 'Dokument';

  useEffect(() => {
    if (dokumentData && dokumentId) {
      updateContext({
        title: headerTitle,
        dokumentId,
        objectType: 'dokument',
        objectId: dokumentId,
      });
    }
  }, [dokumentData, dokumentId, headerTitle, updateContext]);

  if (!isOpen || !dokumentId) return null;

  return (
    <div className="absolute inset-y-4 right-4 z-30 flex w-[min(60vw,1200px)] min-w-[640px] max-w-[1200px]">
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Dokument-Details</p>
            <h3 className="truncate text-lg font-semibold leading-tight text-slate-900">{headerTitle}</h3>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                open('chat', {
                  dokumentId,
                  objectType: 'dokument',
                  objectId: dokumentId,
                  title: headerTitle,
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
                  dokumentId,
                  objectType: 'dokument',
                  objectId: dokumentId,
                  title: headerTitle,
                })
              }
              title="Verlauf"
            >
              <Clock className="h-5 w-5" />
            </Button>
            {mode === 'view' && (
              <Button variant="ghost" size="icon" onClick={() => setMode('edit')} title="Bearbeiten">
                <Pencil className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={close} title="Schließen">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
          <ScrollArea className="h-full">
            <div className="space-y-6 px-6 py-6">
              {mode === 'view' ? (
                <DokumentSummaryView dokumentId={dokumentId} onLoaded={setDokumentData} />
              ) : (
                <DokumentEditView
                  dokumentId={dokumentId}
                  onCancel={() => setMode('view')}
                  onSaved={(updatedDokument) => {
                    if (updatedDokument) {
                      setDokumentData(updatedDokument);
                    }
                    setMode('view');
                  }}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DokumentDialogPanel;

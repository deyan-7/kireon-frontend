"use client";

import React, { useEffect, useState } from 'react';
import { usePflichtDialogStore } from '@/stores/pflichtDialogStore';
import PflichtDetailView from '@/components/laws/PflichtDetailView';
import PflichtEditView from '@/components/laws/PflichtEditView';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Clock, BookOpen, Pencil, X } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { Pflicht } from '@/types/pflicht';

const PflichtDialogPanel: React.FC = () => {
  const { isOpen, pflichtId, title, close } = usePflichtDialogStore();
  const { open, updateContext } = useSidebarStore();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [pflichtData, setPflichtData] = useState<Pflicht | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMode('view');
      setPflichtData(null);
    }
  }, [isOpen]);

  const headerTitle = pflichtData?.thema || title || 'Pflicht';

  useEffect(() => {
    if (pflichtData && pflichtId) {
      updateContext({
        title: headerTitle,
        pflichtId,
        dokumentId: pflichtData.dokument_id,
        objectType: 'pflicht',
        objectId: pflichtId,
        belege: pflichtData.belege || [],
      });
    }
  }, [pflichtData, pflichtId, headerTitle, updateContext]);

  if (!isOpen || !pflichtId) return null;

  return (
    <div className="absolute inset-y-4 right-4 z-30 flex w-[min(70vw,1400px)] min-w-[720px] max-w-[1400px]">
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-white shadow-2xl">
        <div className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pflicht-Details</p>
            <h3 className="truncate text-lg font-semibold leading-tight">{headerTitle}</h3>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                open('chat', {
                  pflichtId,
                  dokumentId: pflichtData?.dokument_id,
                  objectType: 'pflicht',
                  objectId: pflichtId,
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
                  objectType: 'pflicht',
                  objectId: pflichtId,
                  pflichtId,
                  dokumentId: pflichtData?.dokument_id,
                  title: headerTitle,
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
                  title: headerTitle,
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
            <Button variant="ghost" size="icon" onClick={close} title="Schließen">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
          <ScrollArea className="h-full">
            <div className="space-y-6 px-6 py-6">
              {mode === 'view' ? (
                <PflichtDetailView pflichtId={pflichtId} onLoaded={setPflichtData} />
              ) : (
                <PflichtEditView
                  pflichtId={pflichtId}
                  onCancel={() => setMode('view')}
                  onSaved={(updatedPflicht) => {
                    setPflichtData(updatedPflicht);
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

export default PflichtDialogPanel;

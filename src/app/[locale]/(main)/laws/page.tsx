"use client";

import { useState } from 'react';
import { useDokumentPreviews } from '@/lib/hooks/useDokumentPreviews';
import DokumentPreviewTable from '@/components/laws/DokumentPreviewTable';
import CreateDokumentModal from '@/components/laws/CreateDokumentModal';
import { AgentStreamProvider } from '@/context/AgentStreamProvider';
import LawMonitorChatPanel from '@/components/laws/LawMonitorChatPanel';
import { deleteDokument } from '@/lib/services/pflicht-service';
import ResizableSplitView from '@/components/ResizableSplitView';
import { useSidebarStore } from '@/stores/sidebarStore';
import { ContextualSidebar } from '@/components/shared/ContextualSidebar';
import PflichtDialogPanel from '@/components/laws/PflichtDialogPanel';
import DokumentDialogPanel from '@/components/laws/DokumentDialogPanel';
import { usePflichtDialogStore } from '@/stores/pflichtDialogStore';
import { useDokumentDialogStore } from '@/stores/dokumentDialogStore';

export default function LawsPage() {
  const {
    loading,
    refreshing,
    dokumente,
    filterText,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    setFilterText,
    goToPage,
    search,
  } = useDokumentPreviews();

  const [showCreateDokumentModal, setShowCreateDokumentModal] = useState(false);
  const { view, open, close } = useSidebarStore();
  const { open: openPflichtDialog } = usePflichtDialogStore();
  const { open: openDokumentDialog } = useDokumentDialogStore();



  const handleDokumentClick = (dokumentId: string) => {
    const doc = dokumente.find(d => d.id === dokumentId);
    openDokumentDialog(dokumentId, doc?.thema || 'Dokument');
  };

  // Deprecated: handled by handleCloseDetailPanel

  const handlePflichtClick = (pflichtId: number) => {
    const pflicht = dokumente.flatMap(d => d.pflichten).find(p => p.id === pflichtId);
    openPflichtDialog(pflichtId, pflicht?.thema || 'Pflicht-Details');
  };

  // Deprecated: handled by handleCloseDetailPanel


  // Editing is handled within PflichtDetailView via sidebar store

  // Deprecated: handled by handleCloseDetailPanel

  const handleDeleteDokument = async (dokumentId: string) => {
    try {
      await deleteDokument(dokumentId);
      search(filterText);
    } catch (error) {
      console.error('Failed to delete dokument:', error);
      alert('Fehler beim Löschen des Dokuments. Bitte versuchen Sie es erneut.');
    }
  };

  // Optionally refresh after edits

  const handlePflichtDeleted = () => {
    search(filterText);
  };

  const handleCreateDokumentSuccess = () => {
    search(filterText);
  };

  const handleFilterChange = (text: string) => {
    setFilterText(text);
    search(text);
  };

  // Sources now open via sidebar store

  if (loading && dokumente.length === 0 && !refreshing) {
    return <div>Lade Dokumente...</div>;
  }
  
  const isSidebarOpen = view !== null;

  const mainContent = (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Dokumente</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              open('chat', {});
            }}
            className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
            title="Law Monitor Chat öffnen"
          >
            Law Monitor Chat
          </button>
        </div>
      </div>
        <p style={{ marginBottom: '2rem', color: '#666' }}>Alle Dokumente anzeigen</p>

        <DokumentPreviewTable
        dokumente={dokumente}
        filterText={filterText}
        onFilterChange={handleFilterChange}
        onSelectDokument={handleDokumentClick}
        onSelectPflicht={handlePflichtClick}
        onAddNew={() => setShowCreateDokumentModal(true)}
        onDeleteDokument={handleDeleteDokument}
        onDeletePflicht={handlePflichtDeleted}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        refreshing={refreshing}
        />
      </div>

      {/* Overlay panels for Pflicht and Dokument summaries */}
      <PflichtDialogPanel />
      <DokumentDialogPanel />
    </div>
  );

  const sidePanelContent = <ContextualSidebar />;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ResizableSplitView mainContent={mainContent} sidePanelContent={sidePanelContent} isSidePanelOpen={isSidebarOpen} onSidePanelClose={close} />

      {showCreateDokumentModal && (
        <CreateDokumentModal
          isOpen={showCreateDokumentModal}
          onClose={() => setShowCreateDokumentModal(false)}
          onSuccess={handleCreateDokumentSuccess}
        />
      )}

      {/* Old RightSidebar removed; sources handled in ContextualSidebar */}

    </div>
  );
}

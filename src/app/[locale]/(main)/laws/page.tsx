"use client";

import { useState } from 'react';
import { useDokumentPreviews } from '@/lib/hooks/useDokumentPreviews';
// Removed LawsSplitView and BereicheSidebar in favor of ResizableSplitView
import DokumentPreviewTable from '@/components/laws/DokumentPreviewTable';
import PflichtDetailView from '@/components/laws/PflichtDetailDialog';
import PflichtEditView from '@/components/laws/PflichtEditDialog';
import CreateDokumentModal from '@/components/laws/CreateDokumentModal';
import DokumentSummaryView from '@/components/laws/DokumentSummaryDialog';
import RightSidebar from '@/components/shared/RightSidebar';
import { useRightPanelStore } from '@/stores/rightPanelStore';
import { AgentStreamProvider } from '@/context/AgentStreamProvider';
import LawMonitorChatPanel from '@/components/laws/LawMonitorChatPanel';
import { deleteDokument } from '@/lib/services/pflicht-service';
import { Beleg } from '@/types/pflicht';
import ResizableSplitView from '@/components/ResizableSplitView';
import DetailPanel from '@/components/shared/DetailPanel';

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

  const [selectedPflichtId, setSelectedPflichtId] = useState<number | null>(null);
  const [selectedDokumentId, setSelectedDokumentId] = useState<string | null>(null);
  const [editingPflichtId, setEditingPflichtId] = useState<number | null>(null);
  const [showCreateDokumentModal, setShowCreateDokumentModal] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<{ title: string; belege: Beleg[] } | null>(null);
  const [detailPanelTitle, setDetailPanelTitle] = useState('');

  const { isOpen, closePanel } = useRightPanelStore();



  const handleDokumentClick = (dokumentId: string) => {
    const doc = dokumente.find(d => d.id === dokumentId);
    setDetailPanelTitle(doc?.thema || 'Dokument Zusammenfassung');
    setSelectedDokumentId(dokumentId);
  };

  // Deprecated: handled by handleCloseDetailPanel

  const handlePflichtClick = (pflichtId: number) => {
    const pflicht = dokumente.flatMap(d => d.pflichten).find(p => p.id === pflichtId);
    setDetailPanelTitle(pflicht?.thema || 'Pflicht-Details');
    setSelectedPflichtId(pflichtId);
  };

  // Deprecated: handled by handleCloseDetailPanel


  const handleEditPflichtClick = () => {
    if (selectedPflichtId) {
      const pflicht = dokumente.flatMap(d => d.pflichten).find(p => p.id === selectedPflichtId);
      setDetailPanelTitle(`Bearbeite: ${pflicht?.thema}` || 'Pflicht bearbeiten');
      setEditingPflichtId(selectedPflichtId);
      setSelectedPflichtId(null);
    }
  };

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

  const handlePflichtSaved = () => {
    setEditingPflichtId(null);
    search(filterText);
  };

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

  const handleShowBelege = (belege: Beleg[], pflichtThema: string) => {
    setSidebarContent({
      title: `Quellen für: "${pflichtThema}"`,
      belege: belege,
    });
  };

  const handleCloseBelegeSidebar = () => {
    setSidebarContent(null);
  };

  if (loading && dokumente.length === 0 && !refreshing) {
    return <div>Lade Dokumente...</div>;
  }
  
  const handleCloseDetailPanel = () => {
    setSelectedPflichtId(null);
    setEditingPflichtId(null);
    setSelectedDokumentId(null);
    setDetailPanelTitle('');
  };

  const mainContent = (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Dokumente</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              // Open chat panel without specific context; Pflicht dialog provides precise context
              useRightPanelStore.getState().openPanel({});
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

      <DetailPanel
        isOpen={!!selectedPflichtId || !!editingPflichtId || !!selectedDokumentId}
        onClose={handleCloseDetailPanel}
        title={detailPanelTitle}
      >
        {selectedPflichtId && (
          <PflichtDetailView
            pflichtId={selectedPflichtId}
            onClose={handleCloseDetailPanel}
            onEdit={handleEditPflichtClick}
            onShowBelege={handleShowBelege}
          />
        )}
        {editingPflichtId && (
          <PflichtEditView
            pflichtId={editingPflichtId}
            onClose={handleCloseDetailPanel}
            onSave={handlePflichtSaved}
          />
        )}
        {selectedDokumentId && (
          <DokumentSummaryView dokumentId={selectedDokumentId} />
        )}
      </DetailPanel>
    </div>
  );

  const sidePanelContent = (
    <AgentStreamProvider>
      <LawMonitorChatPanel />
    </AgentStreamProvider>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ResizableSplitView
        mainContent={mainContent}
        sidePanelContent={sidePanelContent}
        isSidePanelOpen={isOpen}
        onSidePanelClose={closePanel}
      />

      {showCreateDokumentModal && (
        <CreateDokumentModal
          isOpen={showCreateDokumentModal}
          onClose={() => setShowCreateDokumentModal(false)}
          onSuccess={handleCreateDokumentSuccess}
        />
      )}

      <RightSidebar
        isOpen={!!sidebarContent}
        onClose={handleCloseBelegeSidebar}
        title={sidebarContent?.title || ''}
      >
        {sidebarContent?.belege.map((beleg, index) => (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              {beleg.anker || beleg.quelle}
            </h4>
            <p style={{ color: '#4b5563', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {beleg.textauszug || beleg.text}
            </p>
          </div>
        ))}
      </RightSidebar>

    </div>
  );
}

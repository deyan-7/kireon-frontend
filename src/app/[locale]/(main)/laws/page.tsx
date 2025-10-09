"use client";

import { useState } from 'react';
import { useDokumentPreviews } from '@/lib/hooks/useDokumentPreviews';
import LawsSplitView from '@/components/LawsSplitView';
import BereicheSidebar from '@/components/laws/BereicheSidebar';
import DokumentPreviewTable from '@/components/laws/DokumentPreviewTable';
import PflichtDetailDialog from '@/components/laws/PflichtDetailDialog';
import PflichtEditDialog from '@/components/laws/PflichtEditDialog';
import CreateDokumentModal from '@/components/laws/CreateDokumentModal';
import DokumentSummaryDialog from '@/components/laws/DokumentSummaryDialog';
import RightSidebar from '@/components/shared/RightSidebar';
import { deleteDokument } from '@/lib/services/pflicht-service';
import { Beleg } from '@/types/pflicht';

export default function LawsPage() {
  const {
    loading,
    refreshing,
    dokumente,
    bereichList,
    bereichCounts,
    filterText,
    selectedBereich,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    setFilterText,
    selectBereich,
    goToPage,
    search,
  } = useDokumentPreviews();

  const [selectedPflichtId, setSelectedPflichtId] = useState<number | null>(null);
  const [selectedDokumentId, setSelectedDokumentId] = useState<string | null>(null);
  const [editingPflichtId, setEditingPflichtId] = useState<number | null>(null);
  const [showCreateDokumentModal, setShowCreateDokumentModal] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<{ title: string; belege: Beleg[] } | null>(null);



  const handleDokumentClick = (dokumentId: string) => {
    setSelectedDokumentId(dokumentId);
  };

  const handleCloseDokumentDialog = () => {
    setSelectedDokumentId(null);
  };

  const handlePflichtClick = (pflichtId: number) => {
    setSelectedPflichtId(pflichtId);
  };

  const handleClosePflichtDialog = () => {
    setSelectedPflichtId(null);
  };


  const handleEditPflichtClick = () => {
    if (selectedPflichtId) {
      setEditingPflichtId(selectedPflichtId);
      setSelectedPflichtId(null);
    }
  };

  const handleCloseEditDialog = () => {
    setEditingPflichtId(null);
  };

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

  const sidebar = (
    <BereicheSidebar
      bereiche={bereichList}
      bereichCounts={bereichCounts}
      selected={selectedBereich}
      onSelect={selectBereich}
      totalCount={totalCount}
    />
  );

  if (loading && dokumente.length === 0 && !refreshing) {
    return <div>Lade Dokumente...</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
      <LawsSplitView sidebar={sidebar}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Dokumente</h1>
        </div>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          {selectedBereich
            ? `Anzeigen von Dokumenten für: ${selectedBereich}`
            : "Alle Dokumente anzeigen"}
        </p>

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
      </LawsSplitView>

      {selectedDokumentId && (
        <DokumentSummaryDialog
          dokumentId={selectedDokumentId}
          onClose={handleCloseDokumentDialog}
        />
      )}

      {selectedPflichtId && (
        <PflichtDetailDialog
          pflichtId={selectedPflichtId}
          onClose={handleClosePflichtDialog}
          onEdit={handleEditPflichtClick}
          onShowBelege={handleShowBelege}
        />
      )}

      {editingPflichtId && (
        <PflichtEditDialog
          pflichtId={editingPflichtId}
          onClose={handleCloseEditDialog}
          onSave={handlePflichtSaved}
        />
      )}


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
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePflichtPreviews } from '@/lib/hooks/usePflichtPreviews';
import LawsSplitView from '@/components/LawsSplitView';
import BereicheSidebar from '@/components/laws/BereicheSidebar';
import PflichtPreviewTable from '@/components/laws/PflichtPreviewTable';
import PflichtDetailDialog from '@/components/laws/PflichtDetailDialog';
import PflichtEditDialog from '@/components/laws/PflichtEditDialog';
import CreatePflichtModal from '@/components/laws/CreatePflichtModal';
import CreatedPflichtenDialog from '@/components/laws/CreatedPflichtenDialog';
import { UnifiedLegislationDialog } from '@/components/laws/UnifiedLegislationDialog';
import { AddUrlModal } from '@/components/laws/AddUrlModal';
import { ReviewEntryModal } from '@/components/laws/ReviewEntryModal';
import { Button } from '@/components/ui/button';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { LegislationEntry } from '@/types/legislation-entry';
import { PflichtPreview } from '@/types/pflicht-preview';

export default function LawsPage() {
  const {
    loading,
    previews,
    filteredPreviews,
    bereichList,
    bereichCounts,
    selectedPreview,
    filterText,
    selectedBereich,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    setFilterText,
    selectBereich,
    selectPreview,
    closeDialog,
    goToPage,
    search,
  } = usePflichtPreviews();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<LegislationEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<LegislationEntry | null>(null);
  const [selectedPflichtId, setSelectedPflichtId] = useState<number | null>(null);
  const [editingPflichtId, setEditingPflichtId] = useState<number | null>(null);
  const [showCreatePflichtModal, setShowCreatePflichtModal] = useState(false);
  const [showCreatedPflichtenDialog, setShowCreatedPflichtenDialog] = useState(false);
  const [createdPflichten, setCreatedPflichten] = useState<any[]>([]);

  const handleUrlProcessed = (entry: LegislationEntry) => {
    setPendingEntry(entry);
    setShowAddModal(false);
    setShowReviewModal(true);
  };

  const handleEntrySaved = (entry: LegislationEntry) => {
    // TODO: Add the new entry to the list
    setShowReviewModal(false);
    setPendingEntry(null);
    setEditingEntry(null);
    // Reload entries or add to state
    window.location.reload();
  };

  const handleEditClick = () => {
    if (selectedPflichtId) {
      // Convert Pflicht ID to LegislationEntry for editing
      const legislationEntry: LegislationEntry = {
        id: selectedPflichtId.toString(),
        bereich: selectedPreview?.bereich || undefined,
        gesetzeskuerzel: selectedPreview?.gesetzeskuerzel || undefined,
        gesetzgebung: selectedPreview?.gesetzgebung || '',
        thema: selectedPreview?.thema || '',
        stichtag: new Date().toISOString().split('T')[0], // Default to today
      };
      setEditingEntry(legislationEntry);
      setSelectedPflichtId(null);
    }
  };

  const handlePreviewClick = (preview: PflichtPreview) => {
    setSelectedPflichtId(preview.id);
  };

  const handleClosePflichtDialog = () => {
    setSelectedPflichtId(null);
  };

  const handleEditSave = (updatedEntry: LegislationEntry) => {
    handleEntrySaved(updatedEntry);
  };

  const handleEditPflichtClick = () => {
    console.log('Edit clicked, selectedPflichtId:', selectedPflichtId);
    if (selectedPflichtId) {
      setEditingPflichtId(selectedPflichtId);
      setSelectedPflichtId(null);
    }
  };

  const handleCloseEditDialog = () => {
    setEditingPflichtId(null);
  };

  const handlePflichtSaved = (updatedPflicht: any) => {
    // Refresh the data or handle the updated pflicht
    console.log('Pflicht updated:', updatedPflicht);
    setEditingPflichtId(null);
    // Refresh the data by reloading the current page data
    search(filterText);
  };

  const handlePflichtDeleted = () => {
    console.log('Pflicht deleted');
    // Refresh the data to remove the deleted pflicht
    search(filterText);
  };

  const handleCreatePflichtSuccess = (createdPflichten: any[]) => {
    console.log('Pflichten created:', createdPflichten);
    // Show the created pflichten in a dialog
    setCreatedPflichten(createdPflichten);
    setShowCreatedPflichtenDialog(true);
    // Refresh the data to show the new pflichten in the table
    search(filterText);
  };

  const handleFilterChange = (text: string) => {
    setFilterText(text);
    search(text);
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

  if (loading) {
    return <div>Lade Pflichten...</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
      <LawsSplitView sidebar={sidebar}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Gesetzestexte</h1>
          <Link href="/laws/rahmengesetze">
            <Button className="hover:bg-rose-100" variant="outline">
              <BookOpenIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Rahmengesetze anzeigen
            </Button>
          </Link>
        </div>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          {selectedBereich
            ? `Anzeigen von Pflichten für: ${selectedBereich}`
            : "Alle Pflichten anzeigen"}
        </p>

        <PflichtPreviewTable
          previews={filteredPreviews}
          filterText={filterText}
          onFilterChange={handleFilterChange}
          onSelectPreview={handlePreviewClick}
          onAddNew={() => setShowCreatePflichtModal(true)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
        />
      </LawsSplitView>

              {selectedPflichtId && !editingEntry && (
                <PflichtDetailDialog
                  pflichtId={selectedPflichtId}
                  onClose={handleClosePflichtDialog}
                  onEdit={handleEditPflichtClick}
                  onDelete={handlePflichtDeleted}
                />
              )}

              {editingPflichtId && (
                <PflichtEditDialog
                  pflichtId={editingPflichtId}
                  onClose={handleCloseEditDialog}
                  onSave={handlePflichtSaved}
                />
              )}

      {editingEntry && (
        <UnifiedLegislationDialog
          entry={editingEntry}
          mode="edit"
          onClose={() => setEditingEntry(null)}
          onSave={handleEditSave}
        />
      )}

      {showAddModal && (
        <AddUrlModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUrlProcessed}
        />
      )}

              {showReviewModal && pendingEntry && (
                <ReviewEntryModal
                  entry={pendingEntry}
                  onClose={() => {
                    setShowReviewModal(false);
                    setPendingEntry(null);
                  }}
                  onSave={handleEntrySaved}
                />
              )}

              {showCreatePflichtModal && (
                <CreatePflichtModal
                  isOpen={showCreatePflichtModal}
                  onClose={() => setShowCreatePflichtModal(false)}
                  onSuccess={handleCreatePflichtSuccess}
                />
              )}

              {showCreatedPflichtenDialog && (
                <CreatedPflichtenDialog
                  isOpen={showCreatedPflichtenDialog}
                  onClose={() => setShowCreatedPflichtenDialog(false)}
                  pflichten={createdPflichten}
                />
              )}
    </div>
  );
}
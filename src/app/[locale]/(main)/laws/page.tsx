"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLegislation } from '@/lib/hooks/useLegislation';
import LawsSplitView from '@/components/LawsSplitView';
import GesetzeskuerzelSidebar from '@/components/laws/GesetzeskuerzelSidebar';
import LegislationTable from '@/components/laws/LegislationTable';
import { LegislationDetailDialog } from '@/components/laws/LegislationDetailDialog';
import { AddUrlModal } from '@/components/laws/AddUrlModal';
import { ReviewEntryModal } from '@/components/laws/ReviewEntryModal';
import { Button } from '@/components/ui/button';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { LegislationEntry } from '@/types/legislation-entry';

export default function LawsPage() {
  const {
    loading,
    entries,
    gesetzeskuerzelList,
    gesetzeskuerzelCounts,
    filteredEntries,
    selectedEntry,
    filterText,
    selectedGesetzeskuerzel,
    setFilterText,
    selectGesetzeskuerzel,
    selectEntry,
    closeDialog,
  } = useLegislation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<LegislationEntry | null>(null);

  const handleUrlProcessed = (entry: LegislationEntry) => {
    setPendingEntry(entry);
    setShowAddModal(false);
    setShowReviewModal(true);
  };

  const handleEntrySaved = (entry: LegislationEntry) => {
    // TODO: Add the new entry to the list
    setShowReviewModal(false);
    setPendingEntry(null);
    // Reload entries or add to state
    window.location.reload();
  };

  const sidebar = (
    <GesetzeskuerzelSidebar
      kuerzelList={gesetzeskuerzelList}
      kuerzelCounts={gesetzeskuerzelCounts}
      selected={selectedGesetzeskuerzel}
      onSelect={selectGesetzeskuerzel}
      totalCount={entries.length}
    />
  );

  if (loading) {
    return <div>Lade Gesetzestexte...</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
      <LawsSplitView sidebar={sidebar}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Gesetzestexte</h1>
          <Link href="/laws/rahmengesetze">
            <Button variant="outline">
              <BookOpenIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              Rahmengesetze anzeigen
            </Button>
          </Link>
        </div>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          {selectedGesetzeskuerzel
            ? `Anzeigen von Gesetzestexten für: ${selectedGesetzeskuerzel}`
            : "Alle Gesetzestexte anzeigen"}
        </p>

        <LegislationTable
          entries={filteredEntries}
          filterText={filterText}
          onFilterChange={setFilterText}
          onSelectEntry={selectEntry}
          onAddNew={() => setShowAddModal(true)}
        />
      </LawsSplitView>

      {selectedEntry && (
        <LegislationDetailDialog
          entry={selectedEntry}
          onClose={closeDialog}
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
    </div>
  );
}
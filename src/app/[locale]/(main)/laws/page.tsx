"use client";

import { useLaws } from '@/lib/hooks/useLaws';
import LawsTable from '@/components/LawsTable';
import LawDetailDialog from '@/components/LawDetailDialog';
import LawsSplitView from '@/components/LawsSplitView';
import BereicheSidebar from '@/components/BereicheSidebar';

export default function LawsPage() {
  const {
    bereiche,
    bereichCounts,
    filteredLaws,
    selectedLaw,
    filterText,
    selectedBereich,
    setFilterText,
    selectBereich,
    selectLaw,
    closeDialog,
  } = useLaws();

  const sidebar = (
    <BereicheSidebar
      bereiche={bereiche}
      bereichCounts={bereichCounts}
      selected={selectedBereich}
      onSelect={selectBereich}
    />
  );

  return (
    <div style={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
      <LawsSplitView sidebar={sidebar}>
        <h1>Gesetzestexte</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          {selectedBereich ? `Anzeigen von Gesetzen für: ${selectedBereich.name}` : "Alle Gesetze anzeigen"}
        </p>
        
        <LawsTable
          laws={filteredLaws}
          filterText={filterText}
          onFilterChange={setFilterText}
          onSelectLaw={selectLaw}
        />
      </LawsSplitView>

      {selectedLaw && (
        <LawDetailDialog
          law={selectedLaw}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
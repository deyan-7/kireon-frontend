"use client";

import { useLaws } from '@/lib/hooks/useLaws';
import GeneralLawTable from '@/components/laws/GeneralLawTable';
import GeneralLawDetailDialog from '@/components/laws/GeneralLawDetailDialog';
import LawsSplitView from '@/components/LawsSplitView';
import BereicheSidebar from '@/components/BereicheSidebar';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RahmengesetzePage() {
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
        <div style={{ marginBottom: '1rem' }}>
          <Link 
            href="/laws" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
            Zurück zur Gesetzesübersicht
          </Link>
        </div>
        
        <h1>Rahmengesetze</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          {selectedBereich ? `Anzeigen von Rahmengesetzen für: ${selectedBereich.name}` : "Alle Rahmengesetze anzeigen"}
        </p>
        
        <GeneralLawTable
          laws={filteredLaws}
          filterText={filterText}
          onFilterChange={setFilterText}
          onSelectLaw={selectLaw}
        />
      </LawsSplitView>

      {selectedLaw && (
        <GeneralLawDetailDialog
          law={selectedLaw}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
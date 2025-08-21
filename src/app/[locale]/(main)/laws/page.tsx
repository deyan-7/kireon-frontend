"use client";

import { useLaws } from '@/lib/hooks/useLaws';
import LawsTable from '@/components/LawsTable';
import LawDetailDialog from '@/components/LawDetailDialog';

const pageStyles = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto'
};

export default function LawsPage() {
  const {
    filteredLaws,
    selectedLaw,
    filterText,
    setFilterText,
    selectLaw,
    closeDialog,
  } = useLaws();

  return (
    <div style={pageStyles}>
      <h1>Gesetzestexte</h1>
      <p style={{ marginBottom: '2rem' }}>
        Verwalten und durchsuchen Sie relevante Gesetzestexte und Verordnungen.
      </p>
      
      <LawsTable
        laws={filteredLaws}
        filterText={filterText}
        onFilterChange={setFilterText}
        onSelectLaw={selectLaw}
      />

      {selectedLaw && (
        <LawDetailDialog
          law={selectedLaw}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
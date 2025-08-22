'use client';

import React from 'react';
import { LegislationEntry } from '@/types/legislation-entry';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import styles from './GeneralLawTable.module.scss';

interface LegislationTableProps {
  entries: LegislationEntry[];
  filterText: string;
  onFilterChange: (text: string) => void;
  onSelectEntry: (entry: LegislationEntry) => void;
  onAddNew: () => void;
}

const LegislationTable: React.FC<LegislationTableProps> = ({
  entries,
  filterText,
  onFilterChange,
  onSelectEntry,
  onAddNew,
}) => {
  return (
    <div className={styles.lawsTable}>
      <div className={styles.filterContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Gesetzestexte durchsuchen..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        <Button 
          onClick={onAddNew}
          className="bg-rose-700 hover:bg-rose-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Neuer Eintrag
        </Button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Thema</th>
              <th>Gesetzeskürzel</th>
              <th>Gesetzgebung</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className={styles.clickableRow}
              >
                <td>{entry.thema}</td>
                <td>
                  {entry.gesetzeskuerzel && (
                    <span className={styles.stichwort}>
                      {entry.gesetzeskuerzel}
                    </span>
                  )}
                </td>
                <td>{entry.gesetzgebung}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.noResults}>
                  Keine Gesetzestexte gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LegislationTable;
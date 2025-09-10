import React from 'react';
import { Rahmengesetzgebung } from '@/types/laws';
import styles from './GeneralLawTable.module.scss';

interface GeneralLawTableProps {
  laws: Rahmengesetzgebung[];
  filterText: string;
  onFilterChange: (text: string) => void;
  onSelectLaw: (law: Rahmengesetzgebung) => void;
}

const GeneralLawTable: React.FC<GeneralLawTableProps> = ({ 
  laws, 
  filterText, 
  onFilterChange, 
  onSelectLaw 
}) => {
  return (
    <div className={styles.lawsTable}>
      <div className={styles.filterContainer}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Rahmengesetze durchsuchen..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Kurztitel</th>
              <th>Gesetz</th>
              <th>Stichwort</th>
            </tr>
          </thead>
          <tbody>
            {laws.map((law, index) => (
              <tr 
                key={index} 
                onClick={() => onSelectLaw(law)}
                className={styles.clickableRow}
              >
                <td>{law.kurztitel}</td>
                <td>{law.gesetz}</td>
                <td>
                  <span className={styles.stichwort}>
                    {law.stichwort}
                  </span>
                </td>
              </tr>
            ))}
            {laws.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.noResults}>
                  Keine Rahmengesetze gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralLawTable;
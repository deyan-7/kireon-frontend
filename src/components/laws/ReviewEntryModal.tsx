'use client';

import { useState } from 'react';
import { LegislationEntry } from '@/types/legislation-entry';
import { UnifiedLegislationDialog } from './UnifiedLegislationDialog';

interface ReviewEntryModalProps {
  entry: LegislationEntry;
  onClose: () => void;
  onSave: (entry: LegislationEntry) => void;
}

export function ReviewEntryModal({ entry, onClose, onSave }: ReviewEntryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (updatedEntry: LegislationEntry) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay for mock
      const savedEntry = { ...updatedEntry, id: Date.now().toString() };
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(savedEntry);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      console.error('Error saving entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnifiedLegislationDialog
      entry={entry}
      mode="edit"
      onClose={onClose}
      onSave={handleSave}
      isSaving={loading}
    />
  );
}
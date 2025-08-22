'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { LegislationEntry } from '@/types/legislation-entry';
import { getLegislationEntries, getLegislationEntryDetails } from '@/lib/services/legislation-service';
import { AddUrlModal } from '@/components/laws/AddUrlModal';
import { ReviewEntryModal } from '@/components/laws/ReviewEntryModal';
import { LegislationDetailDialog } from '@/components/laws/LegislationDetailDialog';

export function LegislationTable() {
  const [entries, setEntries] = useState<LegislationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<LegislationEntry | null>(null);
  const [selectedEntryDetails, setSelectedEntryDetails] = useState<LegislationEntry | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getLegislationEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load legislation entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.thema.toLowerCase().includes(searchLower) ||
      entry.gesetzgebung.toLowerCase().includes(searchLower) ||
      (entry.gesetzeskuerzel?.toLowerCase().includes(searchLower) ?? false) ||
      (entry.produktbereich?.toLowerCase().includes(searchLower) ?? false) ||
      (entry.status?.toLowerCase().includes(searchLower) ?? false) ||
      (entry.markt?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const getStatusBadgeVariant = (status: string | null | undefined) => {
    if (!status) return 'outline';
    switch (status) {
      case 'In Kraft':
        return 'default';
      case 'Entwurf':
        return 'secondary';
      case 'Aufgehoben':
      case 'Außer Kraft':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleUrlProcessed = (entry: LegislationEntry) => {
    setPendingEntry(entry);
    setShowAddModal(false);
    setShowReviewModal(true);
  };

  const handleEntrySaved = (entry: LegislationEntry) => {
    setEntries([...entries, entry]);
    setShowReviewModal(false);
    setPendingEntry(null);
  };

  const handleRowClick = async (entry: LegislationEntry) => {
    if (!entry.id) return;
    setIsDetailsLoading(true);
    try {
      const details = await getLegislationEntryDetails(entry.id);
      setSelectedEntryDetails(details);
    } catch (error) {
      console.error("Failed to load legislation details:", error);
      // Optional: Show an error toast/alert to the user
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: de });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Lade Gesetzestexte...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gesetzestexte</CardTitle>
          <CardDescription>
            Übersicht aller erfassten Gesetzestexte und Verordnungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Thema, Gesetz, Titel oder Status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Neuen Eintrag hinzufügen
            </Button>
          </div>

          <Table>
            <TableCaption>
              {filteredEntries.length} von {entries.length} Gesetzestexten
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Thema</TableHead>
                <TableHead>Gesetzeskürzel</TableHead>
                <TableHead>Gesetzgebung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stichtag</TableHead>
                <TableHead>Markt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow 
                  key={entry.id}
                  onClick={() => handleRowClick(entry)}
                  className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{entry.thema}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {entry.produktbereich}
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry.gesetzeskuerzel && (
                      <Badge variant="secondary">{entry.gesetzeskuerzel}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{entry.gesetzgebung}</div>
                  </TableCell>
                  <TableCell>
                    {entry.status && (
                      <Badge variant={getStatusBadgeVariant(entry.status)}>
                        {entry.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(entry.stichtag)}</TableCell>
                  <TableCell>{entry.markt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

      {selectedEntryDetails && (
        <LegislationDetailDialog
          entry={selectedEntryDetails}
          onClose={() => setSelectedEntryDetails(null)}
        />
      )}

      {isDetailsLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
    </>
  );
}
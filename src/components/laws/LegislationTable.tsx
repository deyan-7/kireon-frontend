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
import { Plus, Search, ExternalLink, FileText } from 'lucide-react';
import { LegislationEntry, LegislationStatus } from '@/types/legislation-entry';
import { getLegislationEntries } from '@/lib/services/legislation-service';
import { AddUrlModal } from '@/components/laws/AddUrlModal';
import { ReviewEntryModal } from '@/components/laws/ReviewEntryModal';

export function LegislationTable() {
  const [entries, setEntries] = useState<LegislationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<LegislationEntry | null>(null);

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
      entry.kurztitel.toLowerCase().includes(searchLower) ||
      (entry.kurztitel_englisch?.toLowerCase().includes(searchLower) ?? false) ||
      entry.status.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadgeVariant = (status: LegislationStatus) => {
    switch (status) {
      case LegislationStatus.IN_KRAFT:
        return 'default';
      case LegislationStatus.ENTWURF:
        return 'secondary';
      case LegislationStatus.AUFGEHOBEN:
      case LegislationStatus.AUSSER_KRAFT:
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
                <TableHead>Gesetzgebung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stichtag</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.thema}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.kurztitel}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-mono text-sm">{entry.gesetzgebung}</div>
                      {entry.gesetzeskuerzel && (
                        <div className="text-xs text-muted-foreground">
                          {entry.gesetzeskuerzel}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(entry.stichtag)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {entry.fundstelle_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={entry.fundstelle_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {entry.volltext_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={entry.volltext_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
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
    </>
  );
}
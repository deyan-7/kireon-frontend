'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
import { Plus, Search, Edit } from 'lucide-react';
import { getLawAcronyms } from '@/lib/services/laws-service';
import { LawAcronym } from '@/types/laws';

export function LawAcronymsView() {
  const t = useTranslations();
  console.log('Translations loaded:', t);
  const [acronyms, setAcronyms] = useState<LawAcronym[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadAcronyms = async () => {
      try {
        setLoading(true);
        const data = await getLawAcronyms();
        setAcronyms(data);
      } catch (error) {
        console.error('Failed to load law acronyms:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAcronyms();
  }, []);

  const filteredAcronyms = acronyms.filter(
    (acronym) =>
      acronym.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acronym.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality with modal
    console.log('Edit law:', id);
  };

  const handleAdd = () => {
    // TODO: Implement add functionality with modal
    console.log('Add new law acronym');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Lade Gesetzeskürzel...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gesetzeskürzel verwalten</CardTitle>
        <CardDescription>
          Verwaltung von Abkürzungen und Kurzbezeichnungen für Gesetze und Verordnungen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Stichwort, Gesetz oder Titel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Neues Kürzel
          </Button>
        </div>

        <Table>
          <TableCaption>
            {filteredAcronyms.length} von {acronyms.length} Gesetzeskürzeln
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Kürzel</TableHead>
              <TableHead>Vollständiger Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAcronyms.map((acronym) => (
              <TableRow key={acronym.id}>
                <TableCell className="font-medium">{acronym.acronym}</TableCell>
                <TableCell>{acronym.fullName}</TableCell>
                <TableCell>
                  <Badge variant={acronym.isActive ? 'default' : 'secondary'}>
                    {acronym.isActive ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(acronym.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
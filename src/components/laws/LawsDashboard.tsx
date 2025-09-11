'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode } from 'react';

interface LawsDashboardProps {
  children: ReactNode;
}

export function LawsDashboard({ children }: LawsDashboardProps) {
  const pathname = usePathname();
  
  // Extract the current tab from pathname
  const isAcronymsPage = pathname.includes('/laws/acronyms');
  const currentTab = isAcronymsPage ? 'acronyms' : 'overview';

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gesetzes-Dashboard</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Dokumente und Gesetzeskürzel
        </p>
      </div>

      <Tabs value={currentTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" asChild>
            <Link href="/laws">Übersicht</Link>
          </TabsTrigger>
          <TabsTrigger value="acronyms" asChild>
            <Link href="/laws/acronyms">Gesetzeskürzel verwalten</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div>{children}</div>
    </div>
  );
}
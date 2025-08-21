import { LawsDashboard } from '@/components/laws/LawsDashboard';
import { LegislationTable } from '@/components/laws/LegislationTable';

export default function LawsPage() {
  return (
    <LawsDashboard>
      <LegislationTable />
    </LawsDashboard>
  );
}
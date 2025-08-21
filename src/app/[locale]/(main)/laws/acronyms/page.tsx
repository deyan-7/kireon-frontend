import { LawsDashboard } from '@/components/laws/LawsDashboard';
import { LawAcronymsView } from '@/components/laws/LawAcronymsView';

export default function LawAcronymsPage() {
  return (
    <LawsDashboard>
      <LawAcronymsView />
    </LawsDashboard>
  );
}
import SoftwareManager from '@/components/dashboard/SoftwareManager';

export const dynamic = 'force-dynamic';

export default function SoftwarePage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <SoftwareManager />
    </div>
  );
}

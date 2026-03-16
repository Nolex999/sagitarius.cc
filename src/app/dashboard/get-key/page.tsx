import GetKeyManager from '@/components/dashboard/GetKeyManager';

export const dynamic = 'force-dynamic';

export default function GetKeyPage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <GetKeyManager />
    </div>
  );
}

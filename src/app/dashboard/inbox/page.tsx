import InboxManager from '@/components/dashboard/InboxManager';

export const dynamic = 'force-dynamic';

export default function InboxPage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <InboxManager />
    </div>
  );
}

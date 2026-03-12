type EntryCardProps = {
  name: string;
  category?: string | null;
  info?: string | null;
};

export default function EntryCard({ name, category, info }: EntryCardProps) {
  return (
    <div className="group border-b border-[var(--bg-elevated)] px-4 py-3 transition-colors hover:bg-[#161616]">
      <p className="text-[13px] text-[var(--text-primary)]">{name}</p>
      {(category || info) && (
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
          {[category, info].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  );
}

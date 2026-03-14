type EntryCardProps = {
  name: string;
  category?: string | null;
  info?: string | null;
  email?: string | null;
  habitation?: string | null;
  telephone?: string | null;
};

export default function EntryCard({ 
  name, 
  category, 
  info, 
  email, 
  habitation, 
  telephone 
}: EntryCardProps) {
  return (
    <div className="group border-b border-[var(--bg-elevated)] px-4 py-3 transition-colors hover:bg-[#161616]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">{name}</p>
        {telephone && (
          <span className="font-mono text-[10px] text-[var(--accent)]">{telephone}</span>
        )}
      </div>
      {(category || info || email || habitation) && (
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[var(--text-muted)]">
          {category && <span>{category}</span>}
          {info && <span>{info}</span>}
          {email && <span className="text-[var(--text-secondary)]">{email}</span>}
          {habitation && <span>{habitation}</span>}
        </div>
      )}
    </div>
  );
}

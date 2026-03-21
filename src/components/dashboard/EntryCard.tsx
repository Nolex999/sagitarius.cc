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
    <div className="group relative mx-1 my-1.5 border border-[var(--accent)]/[0.05] bg-[var(--accent)]/[0.02] px-4 py-4 backdrop-blur-sm transition-all hover:bg-[var(--accent)]/[0.06] hover:border-[var(--accent)]/[0.12] rounded-[var(--radius-lg)]">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[13px] font-semibold text-[var(--text-primary)] tracking-tight">{name}</p>
        {telephone && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">{telephone}</span>
        )}
      </div>
      {(category || info || email || habitation) && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--text-secondary)]">
          {category && <span className="text-[var(--text-primary)]/70">{category}</span>}
          {info && <span className="italic">{info}</span>}
          {email && <span className="opacity-80 decoration-white/20 underline underline-offset-4">{email}</span>}
          {habitation && <span className="opacity-60">{habitation}</span>}
        </div>
      )}
    </div>
  );
}

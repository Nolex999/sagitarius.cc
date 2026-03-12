type PlaceholderPageProps = {
  title: string;
  subtitle?: string;
};

export default function PlaceholderPage({
  title,
  subtitle = 'En cours de développement',
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#333]">
        {title}
      </p>
      <div className="h-px w-[200px] overflow-hidden bg-gradient-to-r from-transparent via-[#333] to-transparent" />
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#333]">
        {subtitle}
      </p>
    </div>
  );
}

export function QuizLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-label-sm font-semibold tracking-wider text-primary">/{index}</span>
      <h2 className="text-title-lg font-bold tracking-tight">{children}</h2>
    </div>
  );
}

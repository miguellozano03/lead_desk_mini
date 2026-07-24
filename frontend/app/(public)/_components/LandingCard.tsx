interface LandingCardsProps {
  title: string;
  content: string;
}

export function LandingCard({ title, content }: LandingCardsProps) {
  return (
    <div className="rounded-xl border border-zinc-400 bg-white p-4">
      <p className="text-2xl font-bold text-zinc-900">{title}</p>
      <p className="text-sm text-zinc-500">{content}</p>
    </div>
  );
}

import { type ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-[28px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.75),rgba(12,10,10,0.95))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)]">
      <div className="text-[18px] font-medium text-[#f7d6ab]">{title}</div>
      <div className="mt-1 text-[14px] leading-6 text-white/55">{description}</div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

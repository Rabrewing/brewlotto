import { DashboardContainer, Header, NavigationTabs } from '@/components/brewlotto/dashboard';

const LEGAL_SECTIONS = [
  {
    title: 'Terms of Use',
    body: 'BrewLotto provides informational prediction tooling, explainability surfaces, and account utilities. It does not sell winning guarantees, and users remain responsible for all play decisions and compliance with local lottery rules.',
  },
  {
    title: 'Privacy',
    body: 'Account routes rely on authenticated user records and related preference tables to deliver saved picks, settings, notifications, and entitlement state. V1 keeps this route as the legal index until dedicated long-form policy documents are finalized for the product surface.',
  },
  {
    title: 'Responsible Use',
    body: 'Truth over hype remains a core BrewLotto principle. Predictions and commentary are analytical aids only. Users should treat lottery play as entertainment, set limits, and avoid behavior that creates financial harm or unrealistic expectations.',
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <DashboardContainer>
        <Header />
        <NavigationTabs />

        <div className="mb-5 mt-2 text-[40px] font-medium tracking-[-0.03em] text-[#f8cf98]">Terms &amp; Privacy</div>

        <section className="rounded-[30px] border border-[#ffc742]/24 bg-[radial-gradient(circle_at_top_left,rgba(255,199,66,0.18),rgba(0,0,0,0)_34%),linear-gradient(145deg,rgba(30,20,13,0.88),rgba(8,8,8,0.98))] px-5 py-5 shadow-[0_0_28px_rgba(255,184,28,0.08)]">
          <div className="text-[15px] uppercase tracking-[0.16em] text-white/38">Legal index</div>
          <div className="mt-3 text-[26px] font-semibold text-[#f7ddb3]">One route, no dead links</div>
          <div className="mt-2 max-w-3xl text-[15px] leading-7 text-white/62">V1 keeps legal access centralized here instead of sending the dropdown to separate placeholder pages. This route summarizes the current product posture until full long-form policies are shipped.</div>
        </section>

        <section className="mt-5 space-y-4">
          {LEGAL_SECTIONS.map((section) => (
            <article key={section.title} className="rounded-[26px] border border-[#ffbd39]/18 bg-[linear-gradient(145deg,rgba(28,18,14,0.78),rgba(10,9,9,0.96))] px-5 py-5 shadow-[0_0_20px_rgba(255,184,28,0.05)]">
              <div className="text-[20px] font-medium text-[#f7ddb3]">{section.title}</div>
              <div className="mt-3 text-[15px] leading-7 text-white/62">{section.body}</div>
            </article>
          ))}
        </section>
      </DashboardContainer>
    </main>
  );
}

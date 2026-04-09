export function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-[430px] px-5 pb-6 pt-6 sm:px-6">
      {/* Outer golden aura */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,184,28,0.20),transparent_58%)] blur-2xl" />
      </div>
      
      {/* Device shell with gradient background */}
      <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#120e0e]/96 to-[#08080a]/96 ring-1 ring-[#ffd36f]/25 shadow-[inset_0_0_24px_rgba(255,179,0,0.10),inset_0_0_60px_rgba(255,140,0,0.06)]">
        {/* Floating orbs (decorative) */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ffd364]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-20 h-52 w-52 rounded-full bg-[#ffc742]/10 blur-3xl" />
        
        <div className="relative p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}